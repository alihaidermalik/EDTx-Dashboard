import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import DatePicker from 'material-ui/DatePicker';

const styles = {
    gridKey: {
        textAlign: "right",
        paddingRight: "38px",
        overflow: "hidden",
    },

};

const DateTimeComponent = ({title, onChange, id, value, name}) => {
    return [
        <GridList className="syncGrid" cellHeight={80} cols={3}>
            <GridTile style={styles.gridKey}>
                <span className="syncLabel">{title}</span>
            </GridTile>
            <GridTile cols={2}>
                <DatePicker
                    name={name}
                    id={id}
                    hintText="Pick a date."
                    autoOk={true}
                    onChange={onChange}
                    value={value}
                />
            </GridTile>
        </GridList>
    ]
}

export default DateTimeComponent;