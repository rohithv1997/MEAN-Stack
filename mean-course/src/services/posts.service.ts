import { Injectable } from '@angular/core';
import { IPostDto } from 'src/dto/IPost.dto';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IGetResponse } from 'src/dto/IGetResponse';
import { IDefaultResponse } from 'src/dto/IDefaultResponse';
import { IPostResponse } from 'src/dto/IPostResponse';
import { IPostGetResponse } from 'src/dto/IPost.GetResponse';
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
      .get<IGetResponse>(PostsService.url)
      .pipe(
        map((response) => {
          return response.posts.map((post) => {
            const mapPost: IPostDto = {
              title: post.title,
              content: post.content,
              id: post._id,
            };
            return mapPost;
          });
        })
      )
      .subscribe((transformedPosts) => {
        this._posts = transformedPosts;
        this.updateSubject();
      });
  }

  public addPosts(title: string, content: string): void {
    const post: IPostDto = {
      id: '',
      title: title,
      content: content,
    };
    this.httpClient
      .post<IPostResponse>(PostsService.url, post)
      .subscribe((response) => {
        console.log(response.message);
        const id = response.postId;
        post.id = id;
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

  public getPost(postId: string): Observable<IPostGetResponse> {
    return this.httpClient.get<IPostGetResponse>(
      PostsService.url + '/' + postId
    );
  }

  public updatePost(id: string, title: string, content: string): void {
    const post: IPostDto = {
      id: id,
      title: title,
      content: content,
    };
    this.httpClient
      .put<IDefaultResponse>(PostsService.url + '/' + id, post)
      .subscribe((response) => {
        console.log(response.message);
        const updatedPosts = [...this._posts];
        const oldPostIndex = updatedPosts.findIndex((post) => post.id === id);
        updatedPosts[oldPostIndex] = post;
        this._posts = updatedPosts;
        this.updateSubject();
        this.router.navigate(['/']);
      });
  }
}
