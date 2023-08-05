import React, { useState } from 'react';
import './Axis.css';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Axis() {
  const [activities, setActivities] = useState([{ name: ' ', range: [10, 12], track: true },]);
  const [activityName, setActivityName] = useState('');
  const [sliderDisabled, setSliderDisabled] = useState(false);
  const [lastAddedIndexes, setLastAddedIndexes] = useState([]);

  const handleActivityNameChange = (event) => {
    setActivityName(event.target.value);
  };

  const addActivity = () => {
    if (activities.length < 3) {
      const newActivity = {
        name: activityName || ' ',
        range: [15, 18],
        track: true,
      };
      const sortedActivities = [...activities, newActivity].sort(
        (a, b) => a.range[0] - b.range[0]
      );
      for (let i = 1; i < sortedActivities.length; i++) {
        if (sortedActivities[i].range[0] <= sortedActivities[i - 1].range[1]) {
          sortedActivities[i].range[0] = sortedActivities[i - 1].range[1] + 1;
          sortedActivities[i].range[1] = sortedActivities[i].range[0] + 2;
        }
      }
      setActivities(sortedActivities);
      setActivityName('');
      setLastAddedIndexes([...lastAddedIndexes, sortedActivities.length - 1]);
    }
  };

  const removeLastActivity = () => {
    if (lastAddedIndexes.length > 0) {
      const indexToRemove = lastAddedIndexes[lastAddedIndexes.length - 1];
      const newActivities = [...activities];
      newActivities.splice(indexToRemove, 1);
      setActivities(newActivities);

      const updatedIndexes = [...lastAddedIndexes];
      updatedIndexes.pop();
      setLastAddedIndexes(updatedIndexes);
    }
  };

  const handleSliderChange = (index, newValue) => {
    const newActivities = [...activities];
    newActivities[index].range = newValue;
    setActivities(newActivities);
  };

  const toggleSliderDisabled = () => {
    setSliderDisabled(!sliderDisabled);
  };

  const theme = createTheme({
    components: {
      MuiSlider: {
        styleOverrides: {
        markLabel: {fontSize: '1.2rem'},
        valueLabel: {fontSize: '1.2rem'},
        mark: {height: '0.9rem',
          color: '#003D5B',
          fontSize: '1.2rem',
          textDecoration: 'none'}
        },},
        MuiTextField: {
          styleOverrides: {
            label: {
              color: '#003D5B',
            },
          },
        },
      },
  });

  const isButtonDisabled = activities.length >= 3;
  const isRemoveButtonDisabled = lastAddedIndexes.length === 0;
  const stepWidth = (100 / 24) * 2;

  const marks = [
    { value: 0, label: '00:00' }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 },
    { value: 6, label: '6:00' }, { value: 7 }, { value: 8 }, { value: 9 }, { value: 10 }, { value: 11 },
    { value: 12, label: '12:00' }, { value: 13 }, { value: 14 }, { value: 15 }, { value: 16 }, { value: 17 },
    { value: 18, label: '18:00' }, { value: 19 }, { value: 20 }, { value: 21 }, { value: 22 }, { value: 23 },
    { value: 24, label: '24:00' }];

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="activity-form">
          <Button
              variant="contained"
              onClick={removeLastActivity}
              style={{ fontSize: '2rem', width: '2.2rem', height: '2.2rem', }}
              className={(isRemoveButtonDisabled || sliderDisabled) ? 'grayButton' : ''}
              disabled={isRemoveButtonDisabled || sliderDisabled}>-</Button>
          <Button
            variant="contained"
            onClick={addActivity}
            style={{ fontSize: '2rem', width: '2.2rem', height: '2.2rem', }}
            className={(isButtonDisabled || sliderDisabled) ? 'grayButton' : ''}
            disabled={isButtonDisabled || sliderDisabled}>+</Button>
          <Checkbox
              className='check'
              style={{ fontSize: '2rem', width: '2rem', height: '2rem' }}
              checked={!sliderDisabled} 
              onChange={toggleSliderDisabled}/>
        </div>
        <div className="activity-slider">
          <div className="activity">
            <Slider
              aria-labelledby="range-slider"
              min={0}
              max={24}
              marks={marks}
              disableSwap={true}
              valueLabelDisplay="on"
              value={activities.flatMap((activity) => activity.range)}
              track={true}
              onChange={(event, newValue) => {
                if (!sliderDisabled) {
                  const newValues = [...newValue];
                  let prevValue = null;
                  for (let i = 0; i < newValues.length; i++) {
                    if (prevValue !== null && newValues[i] <= prevValue + 1) {
                      newValues[i] = prevValue + 1;
                    }
                    prevValue = newValues[i];
                  }

                  const newActivities = [...activities];
                  let index = 0;
                  for (let i = 0; i < newActivities.length; i++) {
                    const range = newActivities[i].range;
                    newActivities[i].range = [newValues[index], newValues[index + 1]];
                    index += 2;
                  }
                  
                  const sortedActivities = newActivities.sort(
                    (a, b) => a.range[0] - b.range[0]
                  );
                  
                  for (let i = 1; i < sortedActivities.length; i++) {
                    if (sortedActivities[i].range[0] <= sortedActivities[i - 1].range[1]) {
                      sortedActivities[i].range[0] = sortedActivities[i - 1].range[1] + 1;
                      sortedActivities[i].range[1] = sortedActivities[i].range[0] + 2;
                    }
                  }
                  
                  setActivities(sortedActivities);
                }
              }}
              disabled={sliderDisabled}/>

            {activities.map((activity, index) => (
              <div className="activity-label"
                key={index}
                style={{
                  display: sliderDisabled ? 'block' : 'none',
                  minWidth: `calc(${stepWidth * 2}% )`,
                  width: `calc(${(activity.range[1] - activity.range[0]) * 100 / 24}% )`,
                  left: `${(activity.range[0] * 100) / 24}%`,
                  top: `calc(${(5) - (index * 43 )}px )`,}}>

                <TextField className="cont"
                  label="What are you doing?"
                  value={activity.name}
                  fullWidth
                  focused
                  variant="outlined"
                  size="small"
                  onChange={(event) => {
                    const newActivities = [...activities];
                    newActivities[index].name = event.target.value;
                    setActivities(newActivities);}}
                  InputProps={{
                    style: { fontSize: 18 },
                    left: `calc(${(activity.range[0])})`,}}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Axis;
