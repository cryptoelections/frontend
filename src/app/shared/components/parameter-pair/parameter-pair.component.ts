import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-parameters-pair',
  templateUrl: 'parameter-pair.component.html',
  styleUrls: ['parameter-pair.component.css']
})
export class ParametersPairComponent {
  @Input() public name: string;
  @Input() public value: string;
}
