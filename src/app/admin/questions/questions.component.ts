import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api/api.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent {
  constructor(private api:ApiService, private tostr:ToastrService) {}

  ngOnInit(){
    this.question_form.reset()

    this.question_form.patchValue({
      level:'Select'
    })

    // GETTING ALL QUESTIONS WITH IT'S QUESTION IMAGE
    this.api.questions_all_get().subscribe(res => {
      this.questions = res

      // GETTING THE IMAGE FILE OF THE QUESTION
      for (let ques of this.questions){
        this.api.question_image_get(ques.id).subscribe((res:Blob) => {
          let objectURL = URL.createObjectURL(res);       
          ques.question = objectURL
        })
      }
    })
  }

  questions:any = []
  question_form = new FormGroup({
    test_case1: new FormControl('', Validators.required),
    test_case2: new FormControl('', Validators.required),
    test_case3: new FormControl('', Validators.required),
    out1: new FormControl('', Validators.required),
    out2: new FormControl('', Validators.required),
    out3: new FormControl('', Validators.required),
    level: new FormControl('', Validators.required)
  })

  question_image:FormData = new FormData()
  img_upload(e:Event){
    let fileList = (e.target as HTMLInputElement).files;
    let file = fileList?.item(fileList.length-1)
    this.question_image.set("question", file as Blob)
  }

  add_question(){
    if (this.question_form.controls['test_case1'].invalid){
      this.tostr.warning("Test Case 1 cannot be empty")
    }
    else if (this.question_form.controls['test_case2'].invalid){
      this.tostr.warning("Test Case 2 cannot be empty")
    }
    else if (this.question_form.controls['test_case3'].invalid){
      this.tostr.warning("Test Case 3 cannot be empty")
    }
    else if (this.question_form.controls['out1'].invalid){
      this.tostr.warning("Expected Output 1 cannot be empty")
    }
    else if (this.question_form.controls['out2'].invalid){
      this.tostr.warning("Expected Output 2 cannot be empty")
    }
    else if (this.question_form.controls['out3'].invalid){
      this.tostr.warning("Expected Output 3 cannot be empty")
    }
    else if (this.question_form.controls['level'].value === 'Select'){
      this.tostr.warning("Level of the Question cannot be empty")
    }
    else {
      // ADDING QUESTIONS WITH IT'S IMAGE
      this.api.questions_post(this.question_form.value).subscribe(res => {
        let k:any = {}
        k = res
        this.tostr.success('Question added')
  
        // ADDING QUESTION'S IMAGE
        this.api.question_image_put(k.id, this.question_image).subscribe((res) => {
          k = res;
          if (k.message.includes('Upload successfull')) {
            this.tostr.success('Question Image uploaded.');
          }
        },
        (error) => {
          console.log('error', error);
          this.tostr.error(error.statusText, 'Server Error');
        })
      },
      (error) => {
        console.log('error', error);
        this.tostr.error(error.statusText, 'Server Error');
      })
      this.ngOnInit();
    }
  }
}
