import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {environment} from "../../../environments/environment";
import {ActiveParamsType} from "../../../types/active-params.type";

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  constructor(private http: HttpClient) { }

  private url: string = '';

  setUrl(url: string) {
    this.url = url;
  }

  getUrl(): string {
    return this.url;
  }

  getBestProducts(): Observable<ProductType[]>{
    return this.http.get<ProductType[]>(environment.api + 'products/best')
  }

  getProducts(params: ActiveParamsType): Observable<{totalCount: number, pages: number, items: ProductType[]}>{
    return this.http.get<{totalCount: number, pages: number, items: ProductType[]}>(environment.api + 'products', {
      params: params
    })
  }

  getProduct(url: string): Observable<ProductType>{
    return this.http.get<ProductType>(environment.api + 'products/' + url)
  }

  searchProducts(query: string): Observable<ProductType[]>{
    return this.http.get<ProductType[]>(environment.api + 'products/search?query=' + query)
  }
}
