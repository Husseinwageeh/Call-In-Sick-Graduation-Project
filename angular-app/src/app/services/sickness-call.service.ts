import { Injectable } from '@angular/core';
import { SicknessCall } from '../models/sicknessCall';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';


@Injectable({
  providedIn: 'root'
})
export class SicknessCallService {
  private baseUrl: string = 'http://localhost:3030/users';
  constructor(private http:HttpClient) { }

  public static getSupportedSicknessCalls():SicknessCall[]{
    return [{
      sicknessName:"High Temperature",
      requiredDevice:"Digital Thermometer",
      imageUrl:"https://static.vecteezy.com/system/resources/previews/004/449/715/original/man-with-high-temperature-semi-flat-color-character-posing-figure-full-body-person-on-white-post-covid-syndrome-isolated-modern-cartoon-style-illustration-for-graphic-design-and-animation-vector.jpg",
      desc:"symptoms like sweating a lot, feeling dizzy or lightheaded, having a headache, feeling sick to your stomach, and feeling confused or disoriented"
    },{
      sicknessName:"High/Low Pulse",
      requiredDevice:"Pulse Meter",
      imageUrl:"https://media.istockphoto.com/id/1165507074/vector/blood-pressure-icon.jpg?s=612x612&w=0&k=20&c=bCGG_8rTwK4uDhGKjKVObuG1e1J9zHPGJcPjXWKHs3k=",
      desc:"Feeling low pulse, feeling faint or week,anxious or dizzy"
    },
  { 
   sicknessName:"Low Blood Oxygen Level",
  requiredDevice:"Oximeter",
  imageUrl:"https://img.freepik.com/premium-vector/pulse-oximeter-finger-digital-device-measure-oxygen-saturation_192280-138.jpg",

desc:"feeling short of breath, dizzy, or confused, and your skin might turn blueish"
  }]
  }



postUserReading(id:number,reading:string,sicknessCall:string):Observable<ApiResponse<any>>{
  let apiResponse: ApiResponse<any> = {};

  return this.http
      .post<any>(
        `${this.baseUrl}/sick`,
        {
          id:id,
          reading:reading,
          sicknessCall:sicknessCall
        },
        { observe: 'response' }
      )
      .pipe(
        map((data) => {
          apiResponse.data = data;
          

          return apiResponse;
        }),

        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            apiResponse.error = error.error;
          }

          return of(apiResponse);
        })
      );

}



}
//https://cdn5.vectorstock.com/i/1000x1000/74/19/little-girl-got-high-temperature-cartoon-vector-14817419.jpg