import { NgModule } from '@angular/core';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { CoreModule } from '../core.module';
import { PostRoutingModule } from './post-routing.module';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [CoreModule, PostRoutingModule],
})
export class PostModule {}
