import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-list-users',
  imports: [],
  templateUrl: './list-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListUsersComponent { }
