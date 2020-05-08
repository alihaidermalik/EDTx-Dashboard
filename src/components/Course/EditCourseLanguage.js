import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import { MenuItem } from 'material-ui/Menu';
import { GridList, GridTile } from 'material-ui/GridList';


const styles = {
    gridKey: {
      overflow: "hidden"
    },
    btnWrapper: { 
      width: "40%",
      display: "flex",
      paddingTop: "42px",
      marginLeft: "11%"
    },
    gridKey2: {
        overflow: "hidden",
        display: 'flex',
        alignItems: 'center'
    },
};
const EditCourseLanguage = ({title, name, onChange, value}) => {

    return [(
        <GridList className="syncGrid" cellHeight={80} cols={3}>
            <GridTile style={styles.gridKey}>
                <span className="syncLabel">{title}</span>
            </GridTile>
            <GridTile cols={2} style={styles.gridKey2}>
                <DropDownMenu name={name} styles={{align: "left", "padding-left": "0 !important"}} value={value}
                              onChange={onChange}>
                    <MenuItem value={"English"} primaryText="English"/>
                    <MenuItem value={"French"} primaryText="French"/>
                </DropDownMenu>
            </GridTile>
        </GridList>
    )];

};

export default EditCourseLanguage;