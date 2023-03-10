import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

 import { Hero } from '../interface/heroes';
 import { HeroService } from '../services/hero.service';


@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;

  // searchTerms 属性是 RxJS 的 Subject 类型。
  /*
    Subject 既是可观察对象的数据源，本身也是 Observable。你可以像订阅任何 Observable 一样订阅 Subject。
    你还可以通过调用它的 next(value) 方法往 Observable 中推送一些值，就像 search() 方法中一样。
  */
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      // 防抖操作，对数据处理进行延时操作
      // 在传出最终字符串之前，debounceTime(300) 将会等待，直到新增字符串的事件暂停了 300 毫秒。你实际发起请求的间隔永远不会小于 300ms。
      debounceTime(300),

      // ignore new term if same as previous term
      // distinctUntilChanged() 会确保只在过滤条件变化时才发送请求。
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      // switchMap() 会为每个从 debounce() 和 distinctUntilChanged() 中通过的搜索词调用搜索服务。它会取消并丢弃以前的搜索可观察对象，只保留最近的。
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }


  /* 注意==关于SwitchMap */
  /*
  借助 switchMap 操作符，每个有效的按键事件都会触发一次 HttpClient.get() 方法调用。
  即使在每个请求之间都有至少 300ms 的间隔，仍然可能会同时存在多个尚未返回的 HTTP 请求。
  switchMap() 会记住原始的请求顺序，只会返回最近一次 HTTP 方法调用的结果。以前的那些请求都会被取消和舍弃。
  */

  /*
  注意：
  取消前一个 searchHeroes() 可观察对象并不会中止尚未完成的 HTTP 请求。
  那些不想要的结果只会在它们抵达应用代码之前被舍弃。

  */
}
