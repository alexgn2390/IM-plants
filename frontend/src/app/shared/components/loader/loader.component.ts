import {Component, OnInit} from '@angular/core';
import {LoaderServiceService} from "../../services/loader-service.service";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  private isShowed: boolean = false

  constructor(private loaderService: LoaderServiceService) {}

  ngOnInit(): void {
    this.loaderService.isShowed$.subscribe((isShowed: boolean) => {
      this.isShowed = isShowed
    })
  }
}
