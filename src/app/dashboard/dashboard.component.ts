import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../service/api/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(private router:Router, private tostr:ToastrService, private api:ApiService) {}

  ngOnInit(){
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
      console.log(this.team_current_position_value)
      
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

    // GETTING TEAM CASH, NET_WORTH, STATUS
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
    },1000)


    // setInterval(() => {
    //   this.team_status = []
    //   this.wall_of_fame = []
    //   this.api.status_all_get().subscribe(res => {
    //     k = res
    //     this.team_status = k
      
    //     for (let team of this.team_status){
    //       for (let team_dp of this.team_status_dp){
    //         if (team.team_id != 'admin'){
    //           if (team.team_id != 'NONE'){
    //             if (team_dp.id === team.team_id){
    //               this.wall_of_fame.push(team_dp.dp)
    //               if (this.wall_of_fame.length == 10){
    //                 break;
    //               }
    //             }
    //           }
    //         }
    //       }
    //       if (this.wall_of_fame.length == 10){
    //         break;
    //       }
    //     }
    //     // console.log(this.team_status_dp)
    //     // console.log(this.team_status)
    //   })

      // this.live_transaction = []
      // this.getting_live_transaction()
    // },10000)
    
  }

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

  team_position = '<div class = "relative"><div class="absolute inset-0.5 bg-pink-600 blur rounded-full opacity-75 w-[50px] h-[50px]"></div></div>'
  team_current_position = () => {
    this.list[0]=''
    for (let i=0; i<52; i++){
      if (i === this.team_current_position_value){
        this.list[i] = this.team_position
      }
      else {
        this.list[i] = ''
      }
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
        if ("message" in m){
          console.log(m.message)
        }
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
      })
    },
    error => {
      console.log('error', error)
      this.tostr.error(error.statusText, 'Server Error')
    })


  }

  toggle_box_modal(){
    let box_modal = document.getElementById('box_modal')
    box_modal?.classList.toggle('hidden')

    this.ngOnInit()
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

    if (Number(this.my_details.cash) > Number(this.current_box.value)){
      let k:any = {}
      this.api.transactions_team_id_post(this.my_details.team_id, data_cash).subscribe(res => {
        k = res
        console.log(k)
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
        console.log(p)
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
      "amount": val,
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
    })

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

    this.ngOnInit();
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

  sign_out = () => {
    sessionStorage.removeItem('team_id')
    this.router.navigate([''])
    this.tostr.success('Sign Out successful')
  }
}
