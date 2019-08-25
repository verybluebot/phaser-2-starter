export const mainFont = 'Boogaloo';

export const setStroke = txt => {
    // stroke
    txt.stroke = '#2f2f2f';
    txt.strokeThickness = 4;
};

export const defaultStyle = {
    font: '72px ' + mainFont,
    fill: '#000',
    align: 'center'
};

export const setGradient = txt => {
    const grd = txt.context.createLinearGradient(0, 0, 0, txt.height);

    //  Add in 2 color stops
    grd.addColorStop(0, '#fae90f');
    grd.addColorStop(1, '#f7bb1f');

    //  And apply to the Text
    txt.fill = grd;
};

export const setShadow = txt => {
    txt.setShadow(-5, 5, 'rgba(0,0,0,0.5)', 0);
};

export const styleTitle = txt => {
    // setStroke(txt);
    // setGradient(txt);
    // setShadow(txt);
};
