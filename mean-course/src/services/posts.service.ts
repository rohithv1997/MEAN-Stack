import { Injectable } from '@angular/core';
import { IPostDto } from 'src/dto/IPost.dto';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IGetRequest } from 'src/dto/IGetRequest';
import { IPostRequest } from 'src/dto/IPostRequest';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private _posts: IPostDto[];
  private readonly _postsUpdated: Subject<IPostDto[]>;
  private static readonly url = `${environment.serverUrl}/api/posts`;

  constructor(private httpClient: HttpClient) {
    this._posts = [];
    this._postsUpdated = new Subject();
  }

  public getPosts(): void {
    this.httpClient.get<IGetRequest>(PostsService.url).subscribe((response) => {
      this._posts = response.posts;
      this._postsUpdated.next([...this._posts]);
    });
  }

  public get postsUpdatedObservable(): Observable<IPostDto[]> {
    return this._postsUpdated.asObservable();
  }

  public addPosts(title: string, content: string): void {
    const post: IPostDto = {
      id: '',
      title: title,
      content: content,
    };
    this.httpClient
      .post<IPostRequest>(PostsService.url, post)
      .subscribe((response) => {
        console.log(response.message);
        this._posts.push(post);
        this._postsUpdated.next([...this._posts]);
      });
  }
}
