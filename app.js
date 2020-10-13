

var myConfig = {
    type: 'wordcloud',
    options: {
        text: 'Hello Hello Hello, Jesse Jesse John jadklf abc def',
        minLength: 3,
        maxItems: 20,
        aspect: 'flow-center',

        colorType: 'palette',
        palette: ['#D32F2F', '#5D4037', '#1976D2', '#E53935', '#6D4C41', '#1E88E5', '#F44336', '#795548', '#2196F3', '#EF5350', '#8D6E63', '#42A5F5'],

        style: {
            fontFamily: 'Crete Round',

            hoverState: {
                backgroundColor: '#D32F2F',
                borderRadius: 2,
                fontColor: 'white' 
            },
            tooltip: {
                text: '%text: %hits',
                visible: true,
                alpha: 0.9,
                backgroundColor: '#1976D2',
                borderRadius: 2,
                borderColor: 'none',
                fontColor: 'white',
                fontFamily: 'Georgia',
                textAlpha: 1
            }
        }
    }
};




$('.my-form').on('submit', function () {
    alert('Form submitted!');
    return false;
});