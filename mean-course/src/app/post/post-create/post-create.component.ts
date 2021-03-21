import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IPostDto } from 'src/dto/IPost.dto';
import { PostsService } from 'src/app/post/services/posts.service';
import { mimeTypeValidator } from '../validators/mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  constructor(
    private postsService: PostsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  private mode = 'create';
  private postId!: string | null;
  public post!: IPostDto;
  public isLoading = false;
  public form!: FormGroup;
  public imagePreview = '';
  private authStatusSubscription = new Subscription();
  private getPostSubscription = new Subscription();
  private blob = new Blob();

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeTypeValidator],
      }),
    });

    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(
          this.postId as string,
          (postData) => {
            this.post = {
              id: postData.posts[0].id,
              title: postData.posts[0].title,
              content: postData.posts[0].content,
              imagePath: postData.posts[0].imagePath,
              userId: postData.posts[0].userId,
            } as IPostDto;
            this.isLoading = false;
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath,
            });
          },
          () => {}
        );
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

    this.authStatusSubscription = this.authService.getAuthStatusSubscription(
      (authStatus) => {
        this.isLoading = authStatus;
      }
    );
  }

  get isValidImagePreview(): boolean {
    return (
      this.imagePreview !== '' &&
      this.imagePreview !== null &&
      this.formImage.valid
    );
  }

  get formTitle(): FormArray {
    return this.formControls('title');
  }

  get formContent(): FormArray {
    return this.formControls('content');
  }

  get formImage(): FormArray {
    return this.formControls('image');
  }

  private formControls(property: string): FormArray {
    return <FormArray>this.form.get(property);
  }

  onSavePost(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPosts(
        this.form.value.title as string,
        this.form.value.content as string,
        this.form.value.image as File
      );
    } else {
      this.postsService.updatePost(
        {
          id: this.postId as string,
          title: this.form.value.title as string,
          content: this.form.value.content as string
        } as IPostDto,
        this.form.value.image as File,
        this.blob
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.item(0) as File;
    this.form.patchValue({
      image: file,
    });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = reader.result as string;
      this.blob = new Blob([new Uint8Array(e.target?.result as ArrayBuffer)], {type: file.type });
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.getPostSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }
}
