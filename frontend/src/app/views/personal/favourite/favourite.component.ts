import {Component, Input, OnInit} from '@angular/core';
import {FavouriteService} from "../../../shared/services/favourite.service";
import {FavouriteType} from "../../../../types/favourite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {ProductType} from "../../../../types/product.type";
import {CartService} from "../../../shared/services/cart.service";


@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.scss']
})

export class FavouriteComponent implements OnInit {
  products: FavouriteType[] = []
  serverStaticPath = environment.serverStaticPath
  count: number = 1
  cart: CartType | null = null;
  quantityInCart: { [productId: string]: number } = {};
  isInCart: boolean = false
  product!: ProductType

  @Input() countInCart: number | undefined = 0



  constructor(private favouriteService: FavouriteService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.favouriteService.getFavourites()
      .subscribe((data: FavouriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error)
        }
        this.products = data as FavouriteType[]
      })
    this.cartService.getCart()
      .subscribe((cartData: CartType | DefaultResponseType) => {
        const cartDataResponse = cartData as CartType
        if (cartData) {
          cartDataResponse.items.forEach(item => {
            this.quantityInCart[item.product.id] = item.quantity;
            this.count = this.quantityInCart[item.product.id]
          })
        }
      })
  }

  removeFromFavorites(id: string) {
    this.favouriteService.removeFavourite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  }

  addToCart(productId: string) {
    this.cartService.updateCart(productId, this.count)
      .subscribe((cartData: CartType | DefaultResponseType) => {
        const cartDataResponse = cartData as CartType
        if (cartDataResponse.items && cartDataResponse.items.length > 0) {
          // Обновляем quantityInCart и count только для выбранного продукта
          const productInCart = cartDataResponse.items.find(item => item.product.id === productId);
          if (productInCart) {
            this.quantityInCart[productId] = productInCart.quantity;
            this.count = this.quantityInCart[productId];
          }
        }
      })
  }

  updateCount(productId: string, value: number) {
    this.count = value
    this.cartService.updateCart(productId, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error)
        }
        const cartDataResponse = data as CartType
        if (data) {
          cartDataResponse.items.forEach(item => {
            this.quantityInCart[item.product.id] = this.count
          })
        }
        // if (cartDataResponse.items && cartDataResponse.items.length > 0) {
        //   // Обновляем quantityInCart только для выбранного продукта
        //   const productInCart = cartDataResponse.items.find(item => item.product.id === productId);
        //   if (productInCart) {
        //     this.quantityInCart[productId] = productInCart.quantity;
        //   }
        // } - так тоже работает
      })
  }

  removeFromCart(productId: string) {
    this.cartService.updateCart(productId, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error)
        }
        if (data) {
          const product = this.products.find(p => p.id === productId);
          if (product) {
              this.quantityInCart[productId] = 0
              this.count = 1
          }
        }
      })
  }
}
