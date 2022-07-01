import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {

  title = 'FAQ';

  constructor() {}


  setTitle(title) {
    this.title= title
  }
  ngOnInit() {
  }

  private tutorialHidden: boolean = true;

  abrirTutorial(s: string){

    if(this.tutorialHidden === true){

      this.tutorialHidden = false;
      document.getElementById(s).hidden = false;

    }else if(this.tutorialHidden === false){

      this.tutorialHidden = true;
      document.getElementById(s).hidden = true;

    }

  }
}
