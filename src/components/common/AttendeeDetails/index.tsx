import {Anchor} from "@mantine/core";
import {Attendee} from "../../../types.ts";
import classes from "./AttendeeDetails.module.scss";
 
import {getAttendeeProductTitle} from "../../../utilites/products.ts";

export const AttendeeDetails = ({attendee}: { attendee: Attendee }) => {
    return (
        <div className={classes.orderDetails}>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Name`}
                </div>
                <div className={classes.amount}>
                    {attendee.first_name} {attendee.last_name}
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Email`}
                </div>
                <div className={classes.value}>
                    <Anchor href={'mailto:' + attendee.email} target={'_blank'}>{attendee.email}</Anchor>
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Checked In`}
                </div>
                <div className={classes.amount}>
                    {attendee.check_in ? `Yes` : `No`}
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Product`}
                </div>
                <div className={classes.amount}>
                    {getAttendeeProductTitle(attendee)}
                </div>
            </div>
            <div className={classes.block}>
                <div className={classes.title}>
                    {`Language`}
                </div>
                <div className={classes.amount}>
                    {attendee.locale}
                </div>
            </div>
        </div>
    );
}
