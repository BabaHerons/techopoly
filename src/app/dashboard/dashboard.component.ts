import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../service/api/api.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private router:Router, private tostr:ToastrService, private api:ApiService) {}

  ngOnInit(){
    // console.log(this.br_refresh)
    // let now = new Date().getTime();
    // setTimeout(() => {
    //   let new_now = new Date().getTime()
    //   console.log(new_now - now)
    //   console.log(typeof(new_now))
    // }, 10000);

    this.reward_form.reset();
    this.reward_form.patchValue({
      option:'Choose an option'
    })
    this.random_reward = []
    this.random_penalty = []
    this.t_box_msg = []

    // FOLLOWING ARE THE CHANGES RELATED TO CODING QUESTIONS SECTION
    // -----------------------------------------------------------
    this.code_output = {
      out1:'NONE',
      out2:'NONE',
      out3:'NONE'
    }
    this.correct_answer = false
    this.current_question = {}
    this.monaco_editor = false
    this.codeModel = {
      language: '',
      uri: 'main.json',
      value: 'Please delete this line before you start coding.'
    };
    // -----------------------------------------------------------

    // this.list[0] = this.team_position
    this.live_transaction = []
    this.getting_live_transaction()
    
    this.api.teams_all().subscribe(res => {
      let k:any = {}
      k = res
      this.total_team = k.length
    })

    // FOR GETTING TEAM POSITION AND SETTING TEAM CURRENT POSITION
    this.api.status_id_get(this.my_details.team_id).subscribe(res => {
      let k:any = {}
      k = res
      this.team_current_position_value = Math.floor(k.position) % 52
      // console.log(this.team_current_position_value)
      
      // FOR SETTING TEAM CURRENT POSITION
      this.team_current_position()
    })


    this.my_details = {
      team_id: sessionStorage.getItem('team_id'),
      name: '',
      assets: [],
      cash: '',
      net_worth: 0,
      recent_transaction: {
        gain:'',
        amount:'',
        assets:'',
        message:''
      },
      profile_pic: '',
      recent_asset: '',
      active:''
    }
    
    // GETTING TEAM PROFILE PICTURE
    this.api.teams_profile_pic_team_id_get(this.my_details.team_id).subscribe((res: Blob) => {
      let objectURL = URL.createObjectURL(res);       
      this.my_details.profile_pic = objectURL
    })

    // GETTING TEAM NAME
    this.api.teams_id_get(this.my_details.team_id).subscribe(res => {
      k = res
      this.my_details.name = k.name
    })

    // GETTING TEAM CASH, NET_WORTH, STATUS, ACTIVE
    let k:any = {}
    this.api.status_id_get(this.my_details.team_id).subscribe(res => {
      k = res
      this.my_details.cash = k.cash
      this.my_details.net_worth = Number(k.net_worth)
      this.my_details.active = k.active

      // DISABLING THE ROLL DICE BUTTON
      if (this.my_details.active === 'false'){
        let btnDice = document.getElementById('btnDice')
        this.isDisabled = true
        btnDice?.classList.toggle('roll')
        btnDice?.classList.toggle('roll-disabled')
      }
    })

    // GETTING ASSETS OF THE TEAM
    this.api.assets_team_id_get(this.my_details.team_id).subscribe(res => {
      k = res
      this.my_details.assets = k
      // console.log(this.my_details.assets)
    })

    // GETTING TEAM LATEST TRANSACTION
    this.api.transactions_team_id_get(this.my_details.team_id).subscribe(res => {
      k = res
      this.my_details.recent_transaction = k[k.length-1]
      if((this.my_details.recent_transaction.assets != 'NONE') || this.my_details.recent_transaction.message === "Property sold"){
        this.api.assets_box_id_get(this.my_details.recent_transaction.assets).subscribe(res => {
          let m:any = {}
          m = res
          this.my_details.recent_asset = m.name
        })
      }
    })

    // GETTING All TEAM STATUS
    this.team_status = []
    this.api.status_all_get().subscribe(res => {
      k = res
      this.team_status = k
      // console.log(this.team_status)
    
      this.team_status_dp = []
      for (let team of this.team_status){
        if (team.team_id != 'admin'){
          if (team.team_id != 'NONE'){
            this.api.teams_profile_pic_team_id_get(team.team_id).subscribe((res: Blob) => {
              let objectURL = URL.createObjectURL(res);       
              this.team_status_dp.push({
                id:team.team_id,
                dp:objectURL
              })
            })
          }
        }
      }
    })

    setTimeout(()=>{
      for (let team of this.team_status){
        for (let team_dp of this.team_status_dp){
          if (team.team_id != 'admin'){
            if (team.team_id != 'NONE'){
              if (team_dp.id === team.team_id){
                this.wall_of_fame.push(team_dp.dp)
                if (this.wall_of_fame.length == 10){
                  break;
                }
              }
            }
          }
        }
        if (this.wall_of_fame.length == 10){
          break;
        }
      }
    },2500)


    // if (sessionStorage.getItem('interval_time') === '1'){
    if (this.br_refresh){
      setInterval(() => {
        this.team_status = []
        this.wall_of_fame = []
        this.api.status_all_get().subscribe(res => {
          k = res
          this.team_status = k
        
          for (let team of this.team_status){
            for (let team_dp of this.team_status_dp){
              if (team.team_id != 'admin'){
                if (team.team_id != 'NONE'){
                  if (team_dp.id === team.team_id){
                    this.wall_of_fame.push(team_dp.dp)
                    if (this.wall_of_fame.length == 10){
                      break;
                    }
                  }
                }
              }
            }
            if (this.wall_of_fame.length == 10){
              break;
            }
          }
          // console.log(this.team_status_dp)
          // console.log(this.team_status)
        })
        
        console.log('Interval is working')
        this.live_transaction = []
        this.getting_live_transaction()
      },10000)
      this.populating_all_assets()
      this.br_refresh = false
    }
    

    this.select_lang_form.patchValue({
      lang:"Choose Language"
    })
    
  }

  br_refresh:boolean = true
  waitCount: number = 0;
  interval: any;
  isDisabled = false;
  style: any = {};
  style2: any = {};
  result: number = 0;
  result2: number = 0;
  outcome:any;
  // list = ['','','','','','','','','','','','','','','','','','','','',]
  list = new Array(52)
  team_current_position_value: number = 0
  team_id = sessionStorage.getItem('team_id')
  total_team:number = 0
  current_box:any = {}
  current_question:any = {}
  t_box_msg:any = ""
  random_penalty:any = ""
  random_reward:any = ""
  

  startTimer() {
    let btnDice = document.getElementById('btnDice')
    this.interval = setInterval(() => {
      if (this.waitCount > 0) {
        this.waitCount--;
      } else {
        clearInterval(this.interval);
        this.isDisabled = false;
        btnDice?.classList.toggle('roll')
        btnDice?.classList.toggle('roll-disabled')
      }
    }, 1000);
  }

  randomIntFromInterval(min: any, max: any) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  randomDice = () => {
    let btnDice = document.getElementById('btnDice')
    btnDice?.classList.toggle('roll')
    btnDice?.classList.toggle('roll-disabled')

    let rollInterval:any;
    let rollCount:number = 5
    rollInterval = setInterval(() => {
      if (rollCount > 0) {
        rollCount--;
        this.rollDice(this.randomIntFromInterval(1, 6))
        this.rollDice2(this.randomIntFromInterval(1, 6))
      } else {
        clearInterval(rollInterval);
        this.outcome = this.result + this.result2
        // this.team_current_position()
        this.api_calls()
        this.ngOnInit()
      }
    }, 1000)

    this.waitCount = 10
    this.isDisabled = true;
    // let random = this.randomIntFromInterval(1, 6);
    // this.rollDice(random);
    this.startTimer();
  };

  rollDice = (random: any) => {
    this.style.animation = 'rolling 1s';

    setTimeout(() => {
      switch (random) {
        case 1:
          this.style.transform = 'rotateX(0deg) rotateY(0deg)';
          this.result = 1;
          break;

        case 6:
          this.style.transform = 'rotateX(180deg) rotateY(0deg)';
          this.result = 6;
          break;

        case 2:
          this.style.transform = 'rotateX(-90deg) rotateY(0deg)';
          this.result = 2;
          break;

        case 5:
          this.style.transform = 'rotateX(90deg) rotateY(0deg)';
          this.result = 5;
          break;

        case 3:
          this.style.transform = 'rotateX(0deg) rotateY(90deg)';
          this.result = 3;
          break;

        case 4:
          this.style.transform = 'rotateX(0deg) rotateY(-90deg)';
          this.result = 4;
          break;

        default:
          break;
      }

      this.style.animation = 'none';
      // console.log(this.result);
    }, 100);
  };

  rollDice2 = (random: any) => {
    this.style2.animation = 'rolling 1s';

    setTimeout(() => {
      switch (random) {
        case 1:
          this.style2.transform = 'rotateX(0deg) rotateY(0deg)';
          this.result2 = 1;
          break;

        case 6:
          this.style2.transform = 'rotateX(180deg) rotateY(0deg)';
          this.result2 = 6;
          break;

        case 2:
          this.style2.transform = 'rotateX(-90deg) rotateY(0deg)';
          this.result2 = 2;
          break;

        case 5:
          this.style2.transform = 'rotateX(90deg) rotateY(0deg)';
          this.result2 = 5;
          break;

        case 3:
          this.style2.transform = 'rotateX(0deg) rotateY(90deg)';
          this.result2 = 3;
          break;

        case 4:
          this.style2.transform = 'rotateX(0deg) rotateY(-90deg)';
          this.result2 = 4;
          break;

        default:
          break;
      }

      this.style2.animation = 'none';
      // console.log(this.result);
    }, 100);
  };

  // team_position = '<div class = "relative z-20"><div class="absolute inset-0.5 bg-pink-600 blur rounded-full opacity-75 w-[50px] h-[50px]"></div></div>'
  team_current_position = () => {
    this.list[0]=''
    for (let i=0; i<52; i++){
      let d = document.getElementById((i*1000).toString())
      if (d?.classList.contains('ot-line')){
        d.classList.toggle('ot-line')
        d.classList.toggle('z-10')
      }
      if (i === this.team_current_position_value){
        // this.list[i] = this.team_position
        let div:any = document.getElementById((i*1000).toString())
        div.classList.toggle('ot-line')
        div.classList.toggle('z-10')
      }
      // else {
      //   this.list[i] = ''
      // }
    }
  }

  api_calls(){
    let k:any = {}

    // FOR SETTING NEW TEAM POSITION AND GETTING THE UPDATED DETAILS
    this.api.status_id_position_update_put(this.my_details.team_id, {"position":this.outcome}).subscribe(res => {
      k = res
      this.team_current_position_value = k.position % 52
      this.team_current_position()

      // GETTING ASSETS DETAILS BASED ON POSITON ON THE BOARD
      this.api.assets_box_id_get(this.team_current_position_value).subscribe(res => {
        let m:any = {}
        m = res
        this.current_box = m

        // CHECKING IF THE CURRENT BOX BELONGS TO A PROPERTY OR NOT
        // FOR NON ASSET
        if ("message" in m){
          // console.log(m.message)
          this.toggle_non_asset();
          this.api.non_assets_box_index_get(this.team_current_position_value).subscribe(res => {
            let n:any = {}
            n = res
            this.current_box = n

            // INCOME TAX
            if (this.current_box.name === 'Income Tax'){
              let data = {
                "assets":"NONE",
                "gain":"false",
                "loss":"true",
                "amount":Math.floor(Number(this.current_box.value)*Number(this.my_details.cash)),
                "message": `Income Tax paid`
              }
              this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
                let l:any = {}
                l = res
                if (l.amount === Math.floor(Number(this.current_box.value)*Number(this.my_details.cash)) && l.loss === 'true'){
                  this.tostr.warning(`$${l.amount} has been deducted from your wallet.`, 'Income Tax Paid')
                }
              })
            }

            // SERVICE CHARGE
            else if (this.current_box.name === 'Service Charge'){
              let data = {
                "assets":"NONE",
                "gain":"false",
                "loss":"true",
                "amount":Math.floor(Number(this.current_box.value)*Number(this.my_details.cash)),
                "message": `Service Charge paid`
              }
              this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
                let l:any = {}
                l = res
                if (l.amount === Math.floor(Number(this.current_box.value)*Number(this.my_details.cash)) && l.loss === 'true'){
                  this.tostr.warning(`$${l.amount} has been deducted from your wallet.`, 'Service Charge Paid')
                }
              })
            }

            // JAIL
            else if (this.current_box.name === 'Jail'){
              this.waitCount += 180
            }

            // TREASURY BOX
            else if (this.current_box.name === 'Treasury Box'){
              let now = new Date().getTime()
              if (this.current_box.timeout != 'false'){
                if ((now - Number(this.current_box.timeout)) > 600000){
                  let data = {
                    "assets":"NONE",
                    "gain":"true",
                    "loss":"false",
                    "amount":this.current_box.value,
                    "message": `Treasury Box Opened`
                  }
                  this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
                    let l:any = {}
                    l = res
                    if (l.amount === this.current_box.value && l.gain === 'true'){
                      this.tostr.success(`$${l.amount} has been added to your wallet.`, 'Treasury Box')
                    }
                    this.api.non_assets_treasury_timeout_put(this.current_box.box_index,{"timeout": now}).subscribe(res => {})
                  })
                }
                else {
                  let rem_time = (now - Number(this.current_box.timeout))/1000
                  this.t_box_msg = `This treasury box has been opened recently. And it will be available after ${rem_time} seconds.`
                }
              }
              else {
                let data = {
                  "assets":"NONE",
                  "gain":"true",
                  "loss":"false",
                  "amount":this.current_box.value,
                  "message": `Treasury Box Opened`
                }
                this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
                  let l:any = {}
                  l = res
                  if (l.amount === this.current_box.value && l.gain === 'true'){
                    this.tostr.success(`$${l.amount} has been added to your wallet.`, 'Treasury Box')
                  }
                  this.api.non_assets_treasury_timeout_put(this.current_box.box_index,{"timeout": now}).subscribe(res => {})
                })
              }
            }

            // BLACK HOLE
            else if (this.current_box.name === 'Black Hole'){
              let n:Number = 0
              // function randomIntFromInterval(min:any, max:any) { // min and max included 
              //   return Math.floor(Math.random() * (max - min + 1) + min)
              // }
              n = this.randomIntFromInterval(1, 3)
              
              // GO TO JAIL
              if (n===1){
                if (this.team_current_position_value < 36){
                  this.outcome = 36 - this.team_current_position_value
                }
                else {
                  this.outcome = (52 - this.team_current_position_value) + 36
                }
                this.random_reward.options = 'Jail'
                this.ngOnInit();
                setTimeout(() => {
                  this.api_calls();
                }, 2500);
              }

              // RANDOM REWARD WITH OR WITHOUGHT QUESTION
              else if (n===2){
                this.api.rewards_team_id_get(this.my_details.team_id).subscribe(res => {
                  this.random_reward = res
                  this.random_reward.options = 'reward_question'

                  if (this.random_reward.a === this.random_reward.b === this.random_reward.c === this.random_reward.d === this.random_reward.ans){
                    this.random_reward.options = 'NONE'
                    const data = {
                      "amount":this.random_reward.value,
                      "gain":'true',
                      "loss":'false',
                      "assets":'NONE',
                      "message":"Cash reward from Black Hole"
                    }
                    this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
                      this.tostr.success(`$${this.random_reward.value} has been added to your wallet`, 'Correct Answer')
                    })
                  }
                })
              }

              // RANDOM PENALTY
              else if (n===3){
                this.api.penalty_random_get().subscribe(res => {
                  this.random_penalty = res

                  const data = {
                    "amount":this.random_penalty.value,
                    "gain":'false',
                    "loss":'true',
                    "assets":'NONE',
                    "message":"Penalty charge from Black Hole"
                  }
                  this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
                    this.tostr.warning(`$${this.random_penalty.value} has been deducted as penalty`)
                  })
                })
              }
            }
          })
        }


        // FOR ASSETS
        else {
          this.toggle_box_modal()
          if(this.current_box.current_owner != this.my_details.team_id && this.current_box.current_owner != 'admin'){
            // alert('You will pay rent')
            // DEDUCTING RENT AMOUNT FROM THE CURRENT TEAM
            let data = {
              "assets":"NONE",
              "gain":"false",
              "loss":"true",
              "amount":this.current_box.rent_amount,
              "message": `Rent paid to ${this.current_box.current_owner}`
            }
            let l:any = {}
            this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
              l = res
              if (l.amount === this.current_box.rent_amount && l.loss === 'true'){
                this.tostr.warning(`$${l.amount} has beend deducted from your wallet.`)
              }
            })

            // ADDING RENT AMOUNT TO THE RELEVANT TEAM
            let data_ = {
              "assets":"NONE",
              "gain":"true",
              "loss":"false",
              "amount":this.current_box.rent_amount,
              "message": `Rent paid by ${this.my_details.team_id}`
            }
            let z:any = {}
            this.api.transactions_team_id_post(this.current_box.current_owner, data_).subscribe(res => {
              z = res
            })
          }
        }

        // ALLOTING THE QUESTION IF THE BOX HAS NO OWNER
        if (this.current_box.current_owner === 'admin'){
          this.api.question_random_team_id_get(this.my_details.team_id, this.current_box.ques_level).subscribe(res => {
            this.current_question = res
            this.current_question.test_case1 = this.current_question.test_case1.replace('\\n', '\n')
            this.current_question.test_case2 = this.current_question.test_case2.replace('\\n', '\n')
            this.current_question.test_case3 = this.current_question.test_case3.replace('\\n', '\n')
            // console.log(this.current_question)

            // GETTING THE IMAGE OF THE QUESTION
            this.api.question_image_get(this.current_question.id).subscribe((res: Blob) => {
              let objectURL = URL.createObjectURL(res);       
              this.current_question.question = objectURL
            })
          })
        }
      })
    },
    error => {
      console.log('error', error)
      this.tostr.error(error.statusText, 'Server Error')
    })


  }

  reward_form = new FormGroup({
    option: new FormControl("", Validators.required)
  })
  submit_reward_mcq(){
    if (this.reward_form.controls['option'].value === this.random_reward.ans){
      const data = {
        "amount":this.random_reward.value,
        "gain":'true',
        "loss":'false',
        "assets":'NONE',
        "message":"Cash reward from Black Hole"
      }
      this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
        this.tostr.success(`Correct Answer`)
      })
    } else {
      this.tostr.error('Please continue to roll the dice', 'Wrong Answer')
    }
  }

  pass_jail_timer(){
    if (Number(this.my_details.cash) >= 1500){
      this.waitCount = 0
      let data = {
        "assets":"NONE",
        "gain":"false",
        "loss":"true",
        "amount":Number(this.current_box.value),
        "message": `Jail Charges paid`
      }
      this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
        let l:any = {}
        l = res
        if (l.amount === Number(this.current_box.value) && l.loss === 'true'){
          this.tostr.warning(`$${l.amount} has beend deducted from your wallet.`, 'Jail Charges')
        }
      })
    }
    else {
      this.tostr.warning("Please wait 3 minutes", "Insufficient Cash")
    }
    
  }

  toggle_box_modal(){
    let box_modal = document.getElementById('box_modal')
    box_modal?.classList.toggle('hidden')
  }

  toggle_non_asset(){
    let non_asset = document.getElementById('non_asset_modal')
    non_asset?.classList.toggle('hidden')
  }

  purchase_property() {
    const data_cash = {
      "amount":this.current_box.value,
      "gain":'false',
      "loss":'true',
      "assets":'NONE',
      "message":"Deducting cash for purchasing the property"
    }
    const data_asset = {
      "amount":'NONE',
      "gain":'true',
      "loss":'false',
      "assets":this.current_box.box_index,
      "message": "Property purchased"
    }

    this.api.assets_box_id_get(this.current_box.box_index).subscribe(res => {
      let a:any ={}
      a = res
      if (a.current_owner === 'admin'){
        if (Number(this.my_details.cash) > Number(this.current_box.value)){
          let k:any = {}
          this.api.transactions_team_id_post(this.my_details.team_id, data_cash).subscribe(res => {
            k = res
            // console.log(k)
            if (k.amount === this.current_box.value && k.gain === 'false'){
              this.tostr.success("Transaction is successfull")
            }
            else {
              this.tostr.error('Transaction Failed')
            }
          })
    
          let p:any = {}
          this.api.transactions_team_id_post(this.my_details.team_id, data_asset).subscribe(res => {
            p = res
            // console.log(p)
            if (Number(p.assets) === Number(this.current_box.box_index)){
              this.tostr.success("Property purchased")
            }
            else {
              this.tostr.error("Something went wrong")
            }
          })
        } else {
          this.tostr.info("You don't have enough cash")
        }
      }
      else {
        this.tostr.info("Property Occupied by solving the question faster than you.")
      }
    })

    this.toggle_box_modal();
    this.ngOnInit();
  }

  sell_property(box_index:any) {
    
    let data = {
      "amount":'NONE',
      "gain":'false',
      "loss":'true',
      "assets":box_index,
      "message": "Property sold"
    }
    
    let val:any = ''
    for (let asset of this.my_details.assets){
      if (asset.box_index === box_index){
        val = asset.value
        break
      }
    }
    let data_cash = {
      "amount": Math.floor(0.7 * Math.floor(val)),
      "gain":'true',
      "loss":'false',
      "assets":"NONE",
      "message": "Sold property value added to wallet"
    }
    // ADDING THE PROPERTY VALUE TO THE CASH
    this.api.transactions_team_id_post(this.my_details.team_id, data_cash).subscribe(res => {
      let k:any = {}
      k = res
      if (k.amount === data_cash.amount && k.gain === data_cash.gain){
        this.tostr.success("Money added to wallet")
      }
      else {
        this.tostr.error("Unable to add money to wallet")
      }

      // REMOVING THE PROPERTY FROM THE USER
      this.api.transactions_team_id_post(this.my_details.team_id, data).subscribe(res => {
        let k:any = {}
        k = res
        if (String(k.assets) === String(data.assets) && k.amount === data.amount){
          this.tostr.success("Property Sold")
        }
        else {
          this.tostr.error("Unable to sell the property")
        }
      },
      error => {
        console.log('error', error)
        this.tostr.error(error.statusText, 'Server Error')
      })
    },
    error => {
      console.log('error', error)
      this.tostr.error(error.statusText, 'Server Error')
    })

    

    if (this.isDisabled){
      if (this.waitCount === 0){
        let btnDice = document.getElementById('btnDice')
        btnDice?.classList.toggle('roll')
        btnDice?.classList.toggle('roll-disabled')
        this.isDisabled = false
      }
      else {
        this.tostr.info("Please wait until the Dice rolls completed")
      }
    }

    setTimeout(() => {
      this.ngOnInit();
    }, 1500);
  }

  toggle_portfolio = () => {
    let modal = document.getElementById('portfolio')
    modal?.classList.toggle('hidden')
  }

  my_details = {
    team_id: sessionStorage.getItem('team_id'),
    assets: [
      {
        name: '',
        box_index:'',
        value:''
      }
    ],
    cash: '',
    net_worth: 0,
    recent_transaction: {
      gain:'',
      amount:'',
      assets:'',
      message:''
    },
    profile_pic: '',
    name:'',
    recent_asset:'',
    active:''
  }

  team_status:any = []
  team_status_dp:any = []
  wall_of_fame:any = []
  live_transaction:any = {}
  live_transaction_asset_name:any = ""

  getting_live_transaction(){
    // GETTING LIVE TRANSCATION
    this.api.transactions_all_get().subscribe(res => {
      let k:any = []
      k = res
      this.live_transaction = k[k.length-1]
      if (this.live_transaction.assets != 'NONE'){
        this.api.assets_box_id_get(this.live_transaction.assets).subscribe(res => {
          k = res
          this.live_transaction_asset_name = k.name
        })
      }
    })
  }

  select_lang_form = new FormGroup({
    lang: new FormControl('')
  })
  
  monaco_editor:boolean = false
  toggle_code_quest() {
    let box_modal = document.getElementById('code_question')
    box_modal?.classList.toggle('hidden')

    if (!this.monaco_editor){
      this.monaco_editor = true
    }
  }
  
  theme = 'vs-dark';
  codeModel: any = {
    language: '',
    uri: 'main.json',
    value: 'Please delete this line before you start coding.'
  };
  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  // CHANGING THE CODING LANGUAGE
  change_lang(){
    let cm:any = {
      language: this.select_lang_form.value.lang,
      uri: 'main.json',
    }
    this.codeModel = cm
  }

  // SUBMITTING THE CODE WRITTEN BY USER
  submit_code(){
    let code_lang:any = ''
    if (this.codeModel.language === 'python'){
      code_lang = 'py'
    }
    else if (this.codeModel.language === 'javascript'){
      code_lang = 'js'
    }
    else if (this.codeModel.language === 'java'){
      code_lang = 'java'
    }
    else if (this.codeModel.language === 'cpp'){
      code_lang = 'cpp'
    }

    let data:any = {
      "code": this.codeModel.value,
      "language":code_lang,
      "input": ""
    }

    // CHECKING THE TEST CASE 1
    data.input = this.current_question.test_case1
    this.api.code_output(data).subscribe(res => {
      let k:any = {}
      k = res
      if (k.output.includes(this.current_question.out1)){
        this.code_output.out1 = true
      }
      else {
        this.code_output.out1 = false
      }

      // CHECKING THE TEST CASE 2
      data.input = this.current_question.test_case2
      this.api.code_output(data).subscribe(res => {
        let l:any = {}
        l = res
        if (l.output.includes(this.current_question.out2)){
          this.code_output.out2 = true
        }
        else {
          this.code_output.out2 = false
        }

        // CHECKING THE TEST CASE 3
        data.input = this.current_question.test_case3
        this.api.code_output(data).subscribe(res => {
          let n:any = {}
          n = res
          if (n.output.includes(this.current_question.out3)){
            this.code_output.out3 = true
          }
          else {
            this.code_output.out3 = false
          }

          // IF ALL ANSWERS ARE TRUE THEN MAKING CORRECT ANSWER AS TRUE
          if (this.code_output.out1 && this.code_output.out2 && this.code_output.out3){
            this.correct_answer = true
            
            // API CALLING FOR UPDATING THE SOLVED QUESTIONS IN TEAM STATUS.CODING_QUES
            this.api.status_id_coding_ques_update_put(this.my_details.team_id, {"coding_ques": this.current_question.id}).subscribe(res => {
              let z:any = {}
              z = res
              if (z.team_id === this.my_details.team_id){
                this.tostr.success('Correct Answer')
              }
            })
          }
        },
        error => {
          this.code_output = error.error.error
          console.log(error)
        })
      },
      error => {
        this.code_output = error.error.error
        console.log(error)
      })
    },
    error => {
      this.code_output = error.error.error
      console.log(error)
    })
  }

  // STORING THE OUTPUT FROM COMPILER
  code_output:any = {
    out1:'NONE',
    out2:'NONE',
    out3:'NONE'
  }
  correct_answer = false
  all_assets:any = {0:{desc:''}}

  populating_all_assets(){
    this.all_assets = {}
    let k:any = {}
    this.api.assets_all_get().subscribe(res => {
      k = res
      for (let i of k){
        this.all_assets[i.box_index] = i
      }
      let bh = `Embark on a thrilling cosmic odyssey through the enigmatic blackhole's realm. Seek exciting rewards by answering questions, but beware the unexpected penalties that demand payment, as you navigate this extraordinary stellar terrain.`
      let tbox = `Uncover the treasury box, a block of pure fun and glee. When you land upon it, a cash reward is yours to see. Yet, with a playful twist, you must exercise your patience, for another treasure box can't be claimed for ten minutes' duration.`
      let it = `The income tax block appears, taking 10% of your cash. Watch your wallet shrink, a sly little knock, a playful twist in this taxing game walk.`
      let sc = `Step into the service charge block, where a tiny toll takes a mock. Give up 2% of your wallet's stash, a playful twist that adds to the game's bash.`
      let Jail = `Caught in the clutches of JAIL's domain, two outcomes await, causing joy or disdain. Be surprised by the blackhole's enchanting sway, or endure three minutes, stuck in jail, before you can play.`
      this.all_assets[4] = {box_index: '4', name:'Black Hole', desc:bh}
      this.all_assets[9] = {box_index: '9', name:'Treasury Box', desc:tbox}
      this.all_assets[13] = {box_index: '13', name:'Income Tax', desc:it}
      this.all_assets[17] = {box_index: '17', name:'Treasury Box', desc:tbox}
      this.all_assets[22] = {box_index: '22', name:'Black Hole', desc:bh}
      this.all_assets[26] = {box_index: '26', name:'Service Charge', desc:sc}
      this.all_assets[28] = {box_index: '28', name:'Black Hole', desc:bh}
      this.all_assets[29] = {box_index: '29', name:'Treasury Box', desc:tbox}
      this.all_assets[33] = {box_index: '33', name:'Black Hole', desc:bh}
      this.all_assets[36] = {box_index: '36', name:'Jail', desc:Jail}
      this.all_assets[40] = {box_index: '40', name:'Black Hole', desc:bh}
      this.all_assets[43] = {box_index: '43', name:'Treasury Box', desc:tbox}
      this.all_assets[47] = {box_index: '47', name:'Black Hole', desc:bh}
      // console.log(this.all_assets)
      this.popovers()
    })
  }

  popovers(){
    for (let k=1; k<12; k++){
      if (k===1 || k===11){
        let row = document.getElementById(k.toString())
        let childs:any = row?.children
        for (let i=0; i < childs?.length; i++){
          if (k===1){
            let div:any = ``
            if(this.all_assets[i+k*10].rent_amount){
              div = `<div data-popover id="${i+k*100}" role="tooltip" class="absolute z-[11] invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
              <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                  <h3 class="font-semibold text-gray-900">${this.all_assets[i+k*10].name}</h3>
              </div>
              <div class="px-3 py-2">
                  <img class="w-full h-full" src="/assets/box_img/${i+k*10}.png" alt="">
                  <div class="flex justify-between mt-2">
                    <p>Value: <span class="font-bold">$${this.all_assets[i+k*10].value}</span></p>
                    <p>Rent: <span class="font-bold">$${this.all_assets[i+k*10].rent_amount}</span></p>
                  </div>
                  <div>
                  <p>Question Level: <span class="font-bold">${this.all_assets[i+k*10].ques_level}</span></p>
                  </div>
              </div>
              <div data-popper-arrow></div>
                            </div>`
            }
            else {
              div = `<div data-popover id="${i+k*100}" role="tooltip" class="absolute z-[11] invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
              <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                  <h3 class="font-semibold text-gray-900">${this.all_assets[i+k*10].name}</h3>
              </div>
              <div class="px-3 py-2">
                  <img class="w-full h-full" src="/assets/box_img/${i+k*10}.png" alt="">
                  <p>Description: <span class="font-semibold">${this.all_assets[i+k*10].desc}</span></p>
              </div>
              <div data-popper-arrow></div>
                            </div>`
            }
            
          childs[i].setAttribute('data-popover-target', i+k*100)
          // childs[i].setAttribute('onmouseover', 'mouse_hover($event)')
          childs[i].innerHTML += div
          }
          if (k===11){
            if (k === 11 && i === 0){}
            else {
              let div:any = ``
              if(this.all_assets[52-i].rent_amount){
                div = `<div data-popover id="${i+k*100}" role="tooltip" class="absolute z-[11] invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
                <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                    <h3 class="font-semibold text-gray-900">${this.all_assets[52-i].name}</h3>
                </div>
                <div class="px-3 py-2">
                    <img class="w-full h-full" src="/assets/box_img/${52-i}.png" alt="">
                    <div class="flex justify-between mt-2">
                      <p>Value: <span class="font-bold">$${this.all_assets[52-i].value}</span></p>
                      <p>Rent: <span class="font-bold">$${this.all_assets[52-i].rent_amount}</span></p>
                    </div>
                    <div>
                    <p>Question Level: <span class="font-bold">${this.all_assets[52-i].ques_level}</span></p>
                    </div>
                </div>
                <div data-popper-arrow></div>
                              </div>`
              }
              else {
                div = `<div data-popover id="${i+k*100}" role="tooltip" class="absolute z-[11] invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
                <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                    <h3 class="font-semibold text-gray-900">${this.all_assets[52-i].name}</h3>
                </div>
                <div class="px-3 py-2">
                    <img class="w-full h-full" src="/assets/box_img/${52-i}.png" alt="">
                    <p>Description: <span class="font-semibold">${this.all_assets[52-i].desc}</span></p>
                </div>
                <div data-popper-arrow></div>
                              </div>`
              }
              childs[i].setAttribute('data-popover-target', i+k*100)
              // childs[i].setAttribute('onmouseover', 'mouse_hover($event)')
              childs[i].innerHTML += div
            }
          }
        }
      }
      else if (1<k && k<11){
        let row = document.getElementById(k.toString())
        let childs:any = row?.children
        let div_left:any = ``
            if(this.all_assets[11-k].rent_amount){
              div_left = `<div data-popover id="${k*100}" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
              <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                  <h3 class="font-semibold text-gray-900">${this.all_assets[11-k].name}</h3>
              </div>
              <div class="px-3 py-2">
                  <img class="w-full h-full" src="/assets/box_img/${11-k}.png" alt="">
                  <div class="flex justify-between mt-2">
                    <p>Value: <span class="font-bold">$${this.all_assets[11-k].value}</span></p>
                    <p>Rent: <span class="font-bold">$${this.all_assets[11-k].rent_amount}</span></p>
                  </div>
                  <div>
                  <p>Question Level: <span class="font-bold">${this.all_assets[11-k].ques_level}</span></p>
                  </div>
              </div>
              <div data-popper-arrow></div>
                            </div>`
            }
            else {
              div_left = `<div data-popover id="${k*100}" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
              <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                  <h3 class="font-semibold text-gray-900">${this.all_assets[11-k].name}</h3>
              </div>
              <div class="px-3 py-2">
                  <img class="w-full h-full" src="/assets/box_img/${11-k}.png" alt="">
                  <p>Description: <span class="font-semibold">${this.all_assets[11-k].desc}</span></p>
              </div>
              <div data-popper-arrow></div>
                            </div>`
            }
        let div_right:any = ``
            if(this.all_assets[25+k].rent_amount){
              div_right = `<div data-popover id="${k*100+1}" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
              <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                  <h3 class="font-semibold text-gray-900">${this.all_assets[25+k].name}</h3>
              </div>
              <div class="px-3 py-2">
                  <img class="w-full h-full" src="/assets/box_img/${25+k}.png" alt="">
                  <div class="flex justify-between mt-2">
                    <p>Value: <span class="font-bold">$${this.all_assets[25+k].value}</span></p>
                    <p>Rent: <span class="font-bold">$${this.all_assets[25+k].rent_amount}</span></p>
                  </div>
                  <div>
                  <p>Question Level: <span class="font-bold">${this.all_assets[25+k].ques_level}</span></p>
                  </div>
              </div>
              <div data-popper-arrow></div>
                            </div>`
            }
            else {
              div_right = `<div data-popover id="${k*100+1}" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0">
              <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
                  <h3 class="font-semibold text-gray-900">${this.all_assets[25+k].name}</h3>
              </div>
              <div class="px-3 py-2">
                  <img class="w-full h-full" src="/assets/box_img/${25+k}.png" alt="">
                  <p>Description: <span class="font-semibold">${this.all_assets[25+k].desc}</span></p>
              </div>
              <div data-popper-arrow></div>
                            </div>`
            }

        childs[0].setAttribute('data-popover-target', k*100)
        childs[0].setAttribute("data-popover-placement","left")
        childs[0].innerHTML += div_left

        childs[2].setAttribute('data-popover-target', k*100+1)
        childs[2].setAttribute("data-popover-placement","right")
        childs[2].innerHTML += div_right
      }
    }
  }

  sign_out = () => {
    sessionStorage.removeItem('team_id')
    this.router.navigate([''])
    this.tostr.success('Sign Out successful')
  }
}
