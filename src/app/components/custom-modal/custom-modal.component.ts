import { Component, EventEmitter, Input, Output, OnInit, input } from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription } from 'rxjs';
import { CustomModalService } from './custom-modal.service';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent {

  //title = input<string>('Modal');
  //content = input<string>('This is a custom modal');
  @Input() title: string = 'Modal';
  @Input() content: string = 'This is a custom modal';
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  
}
