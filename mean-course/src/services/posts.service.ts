import { Injectable } from '@angular/core';
import { IPostDto } from 'src/dto/IPost.dto';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IResponse } from 'src/dto/IResponse';
import { IDefaultResponse } from 'src/dto/IDefaultResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _posts: IPostDto[];
  private readonly _postsUpdated: Subject<IPostDto[]>;
  private static readonly url = `${environment.serverUrl}/api/posts`;

  constructor(private httpClient: HttpClient, private router: Router) {
    this._posts = [];
    this._postsUpdated = new Subject();
  }

  private updateSubject() {
    this._postsUpdated.next([...this._posts]);
  }

  public get postsUpdatedObservable(): Observable<IPostDto[]> {
    return this._postsUpdated.asObservable();
  }

  public getPosts(): void {
    this.httpClient
      .get<IResponse>(PostsService.url)
      .pipe(
        map((response) => {
          return response.posts;
        })
      )
      .subscribe((transformedPosts) => {
        this._posts = transformedPosts;
        this.updateSubject();
      });
  }

  public addPosts(title: string, content: string, image: File): void {
    const post: IPostDto = {
      id: '',
      title: title,
      content: content,
      imagePath: '',
    };

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image, title);

    this.httpClient
      .post<IResponse>(PostsService.url, formData)
      .subscribe((response) => {
        console.log(response.message);
        post.id = response.posts[0].id;
        this._posts.push(post);
        this.updateSubject();
        this.router.navigate(['/']);
      });
  }

  public deletePosts(postId: string): void {
    this.httpClient
      .delete<IDefaultResponse>(PostsService.url + '/' + postId)
      .subscribe((response) => {
        console.log(response.message);
        const updatedPosts = this._posts.filter((post) => post.id !== postId);
        this._posts = updatedPosts;
        this.updateSubject();
      });
  }

  public getPost(postId: string): Observable<IResponse> {
    return this.httpClient.get<IResponse>(PostsService.url + '/' + postId);
  }

  public updatePost(post: IPostDto, image: File): void {
    let request: Observable<IDefaultResponse>;
    if (image !== undefined || image !== null) {
      const formData = new FormData();
      formData.append('id', post.id);
      formData.append('title', post.title);
      formData.append('content', post.content);
      formData.append('image', image, post.title);
      request = this.httpClient.put<IDefaultResponse>(
        PostsService.url + '/' + post.id,
        formData
      );
    } else {
      request = this.httpClient.put<IDefaultResponse>(
        PostsService.url + '/' + post.id,
        post
      );
    }

    request.subscribe((response) => {
      console.log(response.message);
      const updatedPosts = [...this._posts];
      const oldPostIndex = updatedPosts.findIndex(
        (postIterated) => postIterated.id === post.id
      );
      updatedPosts[oldPostIndex] = post;
      this._posts = updatedPosts;
      this.updateSubject();
      this.router.navigate(['/']);
    });
  }
}
