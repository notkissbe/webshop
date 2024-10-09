import { Body, Controller, Get, Post, Redirect, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Felhasznalo } from './Felhasznalo.dto';
import { response, Response } from 'express';
//import fs from 'fs';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Redirect("/webshop", 302)
  fooldal(){
  }

  @Get('webshop')
  @Render("webshop")
  getBank() {
    return{
      data:{},
      errors:[]
    };
  }
  @Get('siker')
  @Render("siker")
  getSiker() {
    return{
      
    };
  }

  @Post('webshop')
  postWebshop(
    @Body() Felhasznalo: Felhasznalo,
    @Res() response: Response
  ) {

    let errors = [];

    if (!Felhasznalo.nev || !Felhasznalo.bankszamlaszam) {
      errors.push("Minden mezőt ki kell tölteni!")
    }
    if (!/^\S.*$/.test(Felhasznalo.nev)) {
      errors.push("Tul rovid a felhasznalonev");
    }
    if(!/^\d{8}-\d{8}(-\d{8})?$/.test(Felhasznalo.bankszamlaszam)){
      errors.push("Nem jo a bankszamla formatum")
    }
    if(Felhasznalo.elfogadjaE != "on"){
      errors.push("fogadja el")
    }

    if(errors.length > 0){
      response.render("bank", {
        data: Felhasznalo,
        errors
      })
      return{
        errors
      }
    }

    const fs = require('fs');
    const csv = `${Felhasznalo.nev},${Felhasznalo.bankszamlaszam}\n`;
    fs.appendFileSync('felhasznalok.csv', csv);


    return response.redirect("siker")

  }

}
