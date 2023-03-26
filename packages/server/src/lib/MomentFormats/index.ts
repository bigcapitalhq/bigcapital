import moment from 'moment';

moment.prototype.toMySqlDateTime = function () {
  return this.format('YYYY-MM-DD HH:mm:ss');
};

// moment.fn.businessDiff = function (param) {
//   param = moment(param);
//   var signal = param.unix() < this.unix() ? 1 : -1;
//   var start = moment.min(param, this).clone();
//   var end = moment.max(param, this).clone();
//   var start_offset = start.day() - 7;
//   var end_offset = end.day();

//   var end_sunday = end.clone().subtract('d', end_offset);
//   var start_sunday = start.clone().subtract('d', start_offset);
//   var weeks = end_sunday.diff(start_sunday, 'days') / 7;

//   start_offset = Math.abs(start_offset);
//   if (start_offset == 7)
//     start_offset = 5;
//   else if (start_offset == 1)
//     start_offset = 0;
//   else
//     start_offset -= 2;

//   if (end_offset == 6)
//     end_offset--;

//   return signal * (weeks * 5 + start_offset + end_offset);
// };

// moment.fn.businessAdd = function (days) {
//   var signal = days < 0 ? -1 : 1;
//   days = Math.abs(days);
//   var d = this.clone().add(Math.floor(days / 5) * 7 * signal, 'd');
//   var remaining = days % 5;
//   while (remaining) {
//     d.add(signal, 'd');
//     if (d.day() !== 0 && d.day() !== 6)
//       remaining--;
//   }
//   return d;
// };

// moment.fn.businessSubtract = function (days) {
//   return this.businessAdd(-days);
// };
