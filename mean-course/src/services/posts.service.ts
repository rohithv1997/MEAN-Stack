import { Injectable } from '@angular/core';
import { IPostDto } from 'src/dto/IPost.dto';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly _posts: IPostDto[];
  private readonly _postsUpdated: Subject<IPostDto[]>;

  constructor() {
    this._posts = [];
    this._postsUpdated = new Subject();
  }

  public get Posts(): IPostDto[] {
    return [...this._posts];
  }

  public get postsUpdatedObservable(): Observable<IPostDto[]> {
    return this._postsUpdated.asObservable();
  }

  public addPosts(title: string, content: string): void {
    const post: IPostDto = {
      title: title,
      content: content,
    };
    this._posts.push(post);
    this._postsUpdated.next(this.Posts);
  }
}
