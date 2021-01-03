import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from 'src/services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  constructor(private postsService: PostsService) {}

  ngOnInit(): void {}

  onAddPost(postForm: NgForm): void {
    if (postForm.invalid) {
      return;
    }

    this.postsService.addPosts(
      postForm.value.title as string,
      postForm.value.content as string
    );

    postForm.resetForm();
  }
}
