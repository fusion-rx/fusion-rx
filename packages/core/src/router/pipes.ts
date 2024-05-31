import { PipeTransform } from './pipe-transform.js';

class NumPipe implements PipeTransform<number | undefined> {
    transform(value: string) {
        if (!value) return;
        return parseInt(value);
    }
}

export const PipeNum = new NumPipe();

class BoolPipe implements PipeTransform<boolean | undefined> {
    transform(value: string) {
        if (!value) return;
        return value.toLowerCase() === 'true';
    }
}

export const PipeBool = new BoolPipe();

class DatePipe implements PipeTransform<Date | undefined> {
    transform(value: string) {
        if (!value) return;
        return new Date(value);
    }
}

export const PipeDate = new DatePipe();

class StrArrPipe implements PipeTransform<string[] | undefined> {
    transform(value: string) {
        if (!value) return;
        return value.split(',');
    }
}

export const PipeStrArr = new StrArrPipe();

class NumArrPipe implements PipeTransform<number[] | undefined> {
    transform(value: string) {
        if (!value) return;
        return value.split(',').map((num) => parseInt(num));
    }
}

export const PipeNumArr = new NumArrPipe();

class BoolArrPipe implements PipeTransform<boolean[] | undefined> {
    transform(value: string) {
        if (!value) return;
        return value.split(',').map((bool) => bool.toLowerCase() === 'true');
    }
}

export const PipeBoolArr = new BoolArrPipe();
