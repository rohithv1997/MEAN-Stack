import { Injectable } from '@angular/core';
import { IPostDto } from 'src/dto/IPost.dto';
import { Observable, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IPostResponse } from 'src/dto/IPostResponse';
import { IDefaultResponse } from 'src/dto/IDefaultResponse';
import { Router } from '@angular/router';
import { IPostInfo } from 'src/dto/IPostInfo';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _posts: IPostDto[];
  private readonly _postsUpdated: Subject<IPostInfo>;
  private static readonly url = `${environment.serverUrl}/api/posts`;
  private static readonly pageSizeQueryParam = 'pageSize';
  private static readonly currentPageQueryParam = 'currentPage';

  constructor(private httpClient: HttpClient, private router: Router) {
    this._posts = [];
    this._postsUpdated = new Subject();
  }

  public getPostsUpdatedSubscription(
    callback: (args: IPostInfo) => void
  ): Subscription {
    return this._postsUpdated.subscribe((postInfo) => {
      callback(postInfo);
    });
  }

  public getPosts(pageSize: number, currentPage: number): void {
    const queryParams = `?${PostsService.pageSizeQueryParam}=${pageSize}&${PostsService.currentPageQueryParam}=${currentPage}`;
    this.httpClient
      .get<IPostInfo>(`${PostsService.url}${queryParams}`)
      .subscribe((transformedPostsData) => {
        console.log(transformedPostsData);
        this._posts = transformedPostsData.posts;
        this._postsUpdated.next({
          posts: [...this._posts],
          postCount: transformedPostsData.postCount,
        } as IPostInfo);
      });
  }

  public addPosts(title: string, content: string, image: File): void {
    const post: IPostDto = {
      id: '',
      title: title,
      content: content,
      imagePath: '',
      userId: '1',
    };

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image, title);

    this.httpClient
      .post<IPostResponse>(PostsService.url, formData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  public deletePosts(postId: string, callBack: () => void): void {
    this.httpClient
      .delete<IDefaultResponse>(`${PostsService.url}/${postId}`)
      .subscribe((response) => {
        callBack();
      });
  }

  public getPost(postId: string): Observable<IPostResponse> {
    return this.httpClient.get<IPostResponse>(`${PostsService.url}/${postId}`);
  }

  public updatePost(post: IPostDto, image: File | string): void {
    let request: Observable<IDefaultResponse>;
    if (image !== undefined || image !== null) {
      const formData = new FormData();
      formData.append('id', post.id);
      formData.append('title', post.title);
      formData.append('content', post.content);
      formData.append('image', image, post.title);
      request = this.httpClient.put<IDefaultResponse>(
        `${PostsService.url}/${post.id}`,
        formData
      );
    } else {
      post.userId = '';

      request = this.httpClient.put<IDefaultResponse>(
        `${PostsService.url}/${post.id}`,
        post
      );
    }

    request.subscribe((response) => {
      this.router.navigate(['/']);
    });
  }
}
