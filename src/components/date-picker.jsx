import 'flatpickr/dist/themes/airbnb.css';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin'
import '../assets/css/flatpickr.css';
import React from 'react';
import Flatpickr from 'react-flatpickr';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startDate: new Date(),
      endDate: new Date(),
    };
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this);
  }

  // componentDidMount() {

  // }
  componentDidUpdate() {
    if(this.state.startDate === this.state.endDate) {
      this.setState({startDate: this.props.firstEpoch});
    }
  }

  render() {
    const { startDate, endDate } = this.state;
    var formatDate  = function(oldDate) {
        if(!isNaN(oldDate)) {
          var oldDate = new Date(oldDate);
        }
        return oldDate.getFullYear() + "-" +
        (oldDate.getMonth() + 1) + "-" +
        oldDate.getDate();
    }
    var startDay = formatDate(this.props.firstEpoch);
    var today = formatDate(new Date());

    var options  = {
      enable: [
        {
          from: startDay,
          to: today
        }
      ]
    }
    var makeMakers = function(dObj, dStr, fp, dayElem) {
      var date = dayElem.dateObj;
      this.props.dates.forEach(d => {
        if(formatDate(d) === formatDate(date)) {
          dayElem.innerHTML += "<span class='event'></span>"
        }
      })

    }.bind(this);

    return (
      <div className="date-selector-container">
        <span className="date-label">Start Date:</span>
        <Flatpickr options={options}
          value={startDate} className="flatpickr"
          onDayCreate={makeMakers}
          onChange={startDate => {
            this.setState({ startDate: startDate[0] });
            this.props.getDate(this.state.startDate, this.state.endDate);
          }} />
        <span className="date-label">End Date:</span>
        <Flatpickr options={options}
          value={endDate} className="flatpickr"
          onDayCreate={makeMakers}
          onChange={endDate => {
            this.setState({ endDate: endDate[0] });
            this.props.getDate(this.state.startDate, this.state.endDate);
          }} />
      </div>
    )
  }

}
