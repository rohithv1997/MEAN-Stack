import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IPostDto } from 'src/dto/IPost.dto';
import { PostsService } from 'src/services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute
  ) {}

  private mode = 'create';
  private postId!: string | null;
  public post!: IPostDto;
  public isLoading = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService
          .getPost(this.postId as string)
          .subscribe((postData) => {
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
            } as IPostDto;
            this.isLoading = false;
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(postForm: NgForm): void {
    if (postForm.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPosts(
        postForm.value.title as string,
        postForm.value.content as string
      );
      postForm.resetForm();
    } else {
      this.postsService.updatePost(
        this.postId as string,
        postForm.value.title as string,
        postForm.value.content as string
      );
    }
  }
}
