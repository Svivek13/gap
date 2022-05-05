import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  driftToPercentage(floatingNumber) {
    return (floatingNumber * 100).toFixed(2) + '%';
  }
  capitaliseFirstLetter(stringArray): string {
    return stringArray.map(newString => newString.charAt(0).toUpperCase() + newString.slice(1)).join(', ');
  }

  msToTime(duration) {
    // console.log(duration);
    if (isNaN(duration) || duration < 0) {
        return 'NA';
    }
    // const milliseconds = parseInt((duration % 1000) / 100);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const newHours = (hours < 10) ? '0' + hours : hours;
    const newMinutes = (minutes < 10) ? '0' + minutes : minutes;
    const newSeconds = (seconds < 10) ? '0' + seconds : seconds;

    // return hours + 'h ' + minutes + 'min ' + seconds + '.' + milliseconds + 's';
    return hours + 'h ' + minutes + 'min ' + seconds + 's';
  }

  formatDateTime(dateTime) {
    if (dateTime !== 'NA' && dateTime !== undefined) {
    return new Date(Date.parse(dateTime)).toLocaleString('default', { month: '2-digit', day: '2-digit', year:
    'numeric', hour: '2-digit', minute: '2-digit' }).replace(/,/g, '');
    } else {
      return 'NA';
    }
  }

  fileNameShortener(url) {
    const midway = url.substring(url.lastIndexOf('/') + 1);
    const extension = midway.substring(midway.lastIndexOf('.') + 1);
    const showUrl = midway.slice(0, midway.lastIndexOf('_')) + '.' + extension;
    return showUrl;
  }

  nFormatter(num, digits) {
    const si = [
      { value: 1, symbol: '' },
      { value: 1E3, symbol: 'k' },
      { value: 1E6, symbol: 'M' },
      { value: 1E9, symbol: 'G' },
      { value: 1E12, symbol: 'T' },
      { value: 1E15, symbol: 'P' },
      { value: 1E18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  }

  roundup(v) {
    const num = Math.ceil(v / 100) * 100;
    // Math.pow(10, Math.ceil(Math.log10(v)));
    return num;
}

numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

round(n)
{
  if (n < 10) {
    return n;
  } else {
    if (n % 10 === 0) {
      return n;
    } else {
      return (10 - n % 10) + n;
     }
  }
}

roundFeatureChart(n)
{
  if (n > 0) {
    if (n < 1) {
      return Math.ceil(n);
    } else if (n % 10 === 0) {
      return n;
    } else {
     return (10 - n % 10) + n;
    }
  } else if (n < 0) {
    if (n > -1) {
      return Math.floor(n);
    } else if ((n % -10 === 0)) {
      return n;
    } else {
      return -(10 + n % 10) + n;
    }
  }
}

}
