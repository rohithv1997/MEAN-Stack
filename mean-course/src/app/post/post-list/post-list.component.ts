import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { IPostDto } from 'src/dto/IPost.dto';
import { IPostInfo } from 'src/dto/IPostInfo';
import { PostsService } from 'src/app/post/services/posts.service';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  public posts: IPostDto[] = [];
  private postSubscription: Subscription = new Subscription();
  private authSubscription: Subscription = new Subscription();
  public isLoading = false;
  public totalPosts = 0;
  public pageSize = 1;
  public pageSizeOptions = [1, 2, 5];
  public currentPage = 1;
  public isUserAuthenticated = false;
  public userId!: string;

  private getPosts(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }

  ngOnInit(): void {
    this.getPosts();
    this.postSubscription = this.postsService.getPostsUpdatedSubscription(
      (postInfo: IPostInfo) => {
        this.posts = postInfo.posts;
        this.totalPosts = postInfo.postCount;
        this.isLoading = false;
      }
    );
    this.isUserAuthenticated = this.authService.IsAuthenticated;
    this.userId = this.authService.UserId;
    this.authSubscription = this.authService.getAuthStatusSubscription(
      (isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
        this.userId = this.authService.UserId;
      }
    );
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  public onEdit(): void {}

  public onDelete(postId: string): void {
    this.postsService.deletePosts(postId, () => {
      this.getPosts();
    });
  }

  public onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.getPosts();
  }
}
