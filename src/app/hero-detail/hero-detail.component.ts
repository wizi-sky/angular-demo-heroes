import { Hero } from './../interface/heroes';
// 拆分独立组件
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss'],
})
export class HeroDetailComponent implements OnInit {



  /**
   *1. 属性或参数中使用 ？：表示该属性或参数为可选项
   *2. 属性或参数中使用 ！：表示强制解析（告诉typescript编译器，这里一定有值），常用于vue-decorator中的@Prop
   *3. 变量后使用 ！：表示类型推断排除null、undefined
   */
  // @Input() hero?: Hero;
  // @Input() test!: number;

  // 子组件通知父组件 ==>定义事件
  // childBtnEvent 事件名称，用于父组件通过属性名订阅事件
  @Output() childBtnEvent = new EventEmitter<Hero>();


  /**
   *
   * @param heroService HeroService 从远端服务器获取英雄数据，本组件将使用它来获取要显示的英雄。
   * @param route  ActivatedRoute  保存着到这个 HeroDetailComponent 实例的路由信息。这个组件对从 URL 中提取的路由参数感兴趣。其中的 id 参数就是要显示的英雄的 id。
   * @param location location 是一个 Angular 的服务，用来与浏览器打交道。 稍后，你就会使用它来导航回上一个视图。
   */
  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  test:number=999;
  hero?:Hero;


  ngOnInit(): void {
    console.log("init")
    this.getH()
  }


  // 调用http服务
  getH(): void {
    // 从url之中获取参数
    const id = Number(this.route.snapshot.paramMap.get("id"))
    this.heroService.getHero(id).subscribe(h => {
      this.hero = h
    })
  }

  save():void{
    if(this.hero){
      this.heroService.updateHero(this.hero).subscribe(()=>{
        this.goBack()
      });
    }
  }


  goBack():void{
    this.location.back();
  }


  // 子组件触发事件通过emit发出事件
  // EventEmitter对象  emit() 发送事件   subscribe() 订阅事件
  // clickBtn(hero: Hero):void {
  //   console.log("child")
  //   this.childBtnEvent.emit(hero)
  // }

}
