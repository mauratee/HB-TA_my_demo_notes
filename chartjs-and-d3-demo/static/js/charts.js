'use strict';

new Chart(document.querySelector('#bar-chart'), {
  type: 'bar',
  data: {
    labels: ['Watermelon', 'Cantaloupe', 'Honeydew'],
    datasets: [
      {
        label: 'Today',
        data: [10, 36, 27],
      },
      {
        label: 'Yesterday',
        data: [5, 0, 7],
      },
    ],
  },
});

new Chart(document.querySelector('#bar-colors'), {
  type: 'bar',
  data: {
    labels: ['Watermelon', 'Cantaloupe', 'Honeydew'],
    datasets: [
      {
        label: 'Today',
        data: [15, 36, 27],
      },
      {
        label: 'Yesterday',
        data: [5, 0, 7],
      },
    ],
  },
  options: {
    datasets: {
      bar: {
        // We use a function to automatically set the background color of
        // each bar in the bar chart.
        //
        // There are many other properties that accept functions. For more
        // information see: https://www.chartjs.org/docs/latest/general/options.html#scriptable-options
        backgroundColor: () =>
          // `randomColor` is a JS module we found off GitHub: https://github.com/davidmerfield/randomColor
          // We imported it in templates/chartjs.html
          randomColor(),
      },
    },
    scales: {
      // This is where you can configure x- and y-axes if you don't like the
      // automatic range that Chart.js sets for you.
      //
      // For more info see: https://www.chartjs.org/docs/latest/axes/cartesian/
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 40,
          },
        },
      ],
    },
  },
});

fetch('/sales_this_week.json')
  .then(response => response.json())
  .then(responseJson => {
    const data = responseJson.data.map(dailyTotal => ({
      x: dailyTotal.date,
      y: dailyTotal.melons_sold,
    }));

    new Chart(document.querySelector('#line-time'), {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'All Melons',
            data,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: 'LLLL dd', // Luxon format string
              unit: 'day',
            },
          },
        },
      },
    });
  });
