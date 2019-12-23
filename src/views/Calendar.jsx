import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import {Calendar, momentLocalizer} from "react-big-calendar";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import Card from "components/Card/Card.jsx";
import { events } from "variables/Variables.jsx";

const localizer = momentLocalizer(moment);
 
class CalendarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: events,
      alert: null,
    };
    this.hideAlert = this.hideAlert.bind(this);
  }

  selectedEvent(event) {
    alert(event.title);
  }

  addNewEventAlert(slotInfo) {
    this.setState({
      alert: (
        <SweetAlert
          input
          validationMsg={'El nombre es requerido para realizar la reserva.'}
          showCancel
          style={{ display: "block", marginTop: "-100px", position: "center" }}
          title="Ingrese nombre del evento"
          onConfirm={e => this.addNewEvent(e, slotInfo)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
        />
      )
    });
  }

  addNewEvent(e, slotInfo) {
    var newEvents = this.state.events;
    newEvents.push({
      title: e,
      start: slotInfo.start,
      end: slotInfo.end
    });
    this.setState({
      alert: null,
      events: newEvents
    });
  }

  eventColors(event, start, end, isSelected) {
    var backgroundColor = "rbc-event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor
    };
  }
  hideAlert() {
    this.setState({
      alert: null
    });
  }
  render() {
    return (
      <div className="main-content">
        {this.state.alert}
        <Grid fluid>
          <Row>
            <Col md={10} mdOffset={1}>
              <Card
                calendar
                content={
                  <Calendar
                    selectable
                    step={30}
                    localizer={localizer}
                    events={this.state.events}
                    defaultView="week"
                    views={['week']}
                    scrollToTime={new Date(1970, 1, 1, 6)}
                    defaultDate={new Date()}
                    onSelectEvent={event => this.selectedEvent(event)}
                    onSelectSlot={slotInfo => this.addNewEventAlert(slotInfo)}
                    eventPropGetter={this.eventColors}
                  />
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default CalendarComponent;
