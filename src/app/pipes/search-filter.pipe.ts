import { Pipe, PipeTransform } from '@angular/core';
import { UserDTO } from '../model/user-dto';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: UserDTO[], search: string): UserDTO[]  {
    if(value){
      const regex = new RegExp(search, 'i')
      return value.filter(user => regex.test(user.userName))
    }
    else
    return value
  }

}
