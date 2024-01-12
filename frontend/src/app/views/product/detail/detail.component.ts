import {Component} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ProductType} from "../../../../types/product.type";
import {ProductService} from "../../../shared/services/product.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";
import {FavouriteService} from "../../../shared/services/favourite.service";
import {FavouriteType} from "../../../../types/favourite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent {
  recommendedProducts: ProductType[] = []
  product!: ProductType
  serverStaticPath = environment.serverStaticPath
  count: number = 1
  isLogged: boolean = false

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 24,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }

  constructor(private productService: ProductService,
              private activatedRoute: ActivatedRoute,
              private cartService: CartService,
              private favouriteService: FavouriteService,
              private authService: AuthService,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn()
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn
    })
    this.activatedRoute.params.subscribe(params => {
      this.productService.getProduct(params['url'])
        .subscribe((data: ProductType) => {
            this.product = data
          // console.log(params['url'])
            this.cartService.getCart()
              .subscribe((cartData: CartType | DefaultResponseType) => {
                if ((cartData as DefaultResponseType).error !== undefined) {
                  const error = (cartData as DefaultResponseType).message;
                  throw new Error(error)
                }
                const  cartDataResponse = cartData as CartType
                if (cartData) {
                  const productInCart = cartDataResponse.items.find(item => item.product.id === data.id)
                  if (productInCart) {
                    this.product.countInCart = productInCart.quantity
                    this.count = this.product.countInCart
                  }
                }
              })
            if (!this.authService.getIsLoggedIn()) {
              this.favouriteService.getFavourites()
                .subscribe((data: FavouriteType[] | DefaultResponseType) => {
                  if ((data as DefaultResponseType).error !== undefined) {
                    const error = (data as DefaultResponseType).message;
                    throw new Error(error)
                  }
                  const products = data as FavouriteType[]
                  const currentProductExists = products.find(item => item.id === this.product.id)
                  if (currentProductExists) {
                    this.product.isInFavourite = true;
                  }
                })
            }
          }
        )
    })
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.recommendedProducts = data
      })
  }

  updateCount(value: number) {
    this.count = value
    this.count = value
    if (this.product.countInCart) {
      this.cartService.updateCart(this.product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error)
          }
          this.product.countInCart = this.count
          // this.cartService.count = this.count
        })
    }
  }

  addToCart() {
    this.cartService.updateCart(this.product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error)
        }
        this.product.countInCart = this.count
      })
  }

  removeFromCart() {
    this.cartService.updateCart(this.product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error)
        }
        this.product.countInCart = 0
        this.count = 1
      })
  }

  updateFavourite() {
    if (!this.authService.getIsLoggedIn()) {
      this._snackBar.open('Для добавления в избранное необходимо авторизоваться');
      return;
    }
    if (this.product.isInFavourite) {
      this.favouriteService.removeFavourite(this.product.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            throw new Error(data.message);
          }
          this.product.isInFavourite = false
        })
    } else {
      this.favouriteService.addFavourite(this.product.id)
        .subscribe((data: FavouriteType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          this.product.isInFavourite = true
        })
    }
  }
}
