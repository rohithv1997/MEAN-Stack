import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPostDto } from 'src/dto/IPost.dto';
import { PostsService } from 'src/services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(private postsService: PostsService) {}

  public posts: IPostDto[] = [];
  private subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.postsService.postsUpdatedObservable.subscribe(
      (posts: IPostDto[]) => {
        this.posts = posts;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onEdit(): void {}

  public onDelete(): void {}
}
