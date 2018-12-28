import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { LoginPage } from './login';
import { SpinWheelComponent } from '../../components/spin-wheel/spin-wheel';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule { }
