import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {count, Observable, pipe, Subject, tap} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {environment} from "../../../environments/environment";
import {CartType} from "../../../types/cart.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private count: number = 0
  count$: Subject<number> = new Subject<number>()

  constructor(private http: HttpClient) {}

  setCount(count: number) {
    this.count = count
    this.count$.next(this.count)
  }

  getCart(): Observable<CartType | DefaultResponseType> {
    return this.http.get<CartType | DefaultResponseType>(environment.api + 'cart', {withCredentials: true});
  }

  getCartCount(): Observable<{ count: number } | DefaultResponseType> {
    return this.http.get<{ count: number } | DefaultResponseType>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty('error'))
            this.count = (data as { count: number }).count
          this.count$.next(this.count)

          this.setCount((data as { count: number }).count)
          // console.log(this.count)
        })
      )
  }

  updateCart(productId: string, quantity: number): Observable<CartType> {
    return this.http.post<CartType>(environment.api + 'cart', {
      productId, quantity
    }
    ,
      {withCredentials: true})
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty('error')) {
            let count = 0;
            (data as CartType).items.forEach(item => {
              count += item.quantity
            })
            // console.log(this.count)
            this.setCount(count)
          }
        })
      )
  }
}
