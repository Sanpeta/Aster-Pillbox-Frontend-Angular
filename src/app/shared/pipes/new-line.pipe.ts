import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'newline',
	standalone: true,
})
export class NewLinePipe implements PipeTransform {
	transform(value: string[], separator: string = ','): string {
		return value ? value.join(', \n') : '';
	}
}
