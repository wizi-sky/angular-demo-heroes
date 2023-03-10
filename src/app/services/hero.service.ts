import { Injectable } from '@angular/core';
import { HEROES } from '../mock/heroes.mock';
import { Hero } from '../interface/heroes';
import { LogService } from './log.service';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // 全局注入
})
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  // 服务也可以注入其他的服务
  constructor(
    private logger: LogService,
    private messageService: MessageService,
    private httpClient: HttpClient,
  ) { }



  /* 私有化方法 */
  private log(val: string): void {
    this.messageService.add(val)
  }


  /*  get请求==获取数据list*/

  // 您的应用程序的其余部分将以相同的方式工作，因为 of() 是一个 Observable，您稍后可以像使用 this.http.get(...) 一样订阅或链接操作符。
  // of() 所做的唯一一件事是它在订阅时立即将其参数作为单次发射发出，然后发送 complete 通知。
  getHeroesList(): Observable<Hero[]> {
    // http.get() 替换了 of()，没有做其它修改，但是应用仍然在正常工作，这是因为这两个函数都返回了 Observable<Hero[]>。
    return this.httpClient.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /* get请求===通过id获取数据 */

  // 变量后使用 ！：表示类型推断排除null、undefined
  getHero(id: number): Observable<Hero> {
    // 通过接口服务调用获取参数
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }


  /* put请求=== 修改英雄 */
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  updateHero(hero: Hero): Observable<any> {
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  sendMessage(msg: string): void {
    this.messageService.add(msg)
  }

  /* post请求 -=== 添加英雄 */

  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }


  /* delete 请求===删除英雄 */
  delHero(id: number): Observable<Hero> {
    console.log(id, 'id');
    const url = `${this.heroesUrl}/${id}`
    return this.httpClient.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log('删除英雄id为' + id)),
      catchError(this.handleError<Hero>("deleteHero"))
    )

  }


  /* 远程搜索动态搜索======search */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]);
    return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(list => list.length ? this.log("hasList") : this.log("noList")),
      catchError(this.handleError<Hero[]>("searchError", []))
    )
  }







  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
