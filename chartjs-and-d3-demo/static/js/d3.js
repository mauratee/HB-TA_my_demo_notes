'use strict';

// We've wrapped each demo in its own 'immediately-invoked function':
//
// (() => {
//   console.log('hi!');
// })();
//
// An immediately-invoked function is one that gets called right afer it's been
// defined. Otherwise, it's just a regular function - variables that are created
// in the function are locally-scoped and disappear when the function ends.
//
// Here, we use immediately-invoked functions so we can reuse variable names in
// different contexts (we reuse `const svg` twice in this demo)

(() => {
  const svg = d3.select('#basic-demo svg');

  svg
    // select elements (even though they don't exist yet!)
    .selectAll('rect')

    .data([50, 100, 200, 100, 50])
    // enters loop
    .enter()
    .append('rect')
    // where start on y axis, callback function as second parameter
    // idx is 
    .attr('y', (num, idx) => idx * 40)
    // where does it start
    .attr('x', 0)
    // width taking in callback function as second parameter,
    // changes based on data in array
    .attr('width', num => num)
    // set height of all elements
    .attr('height', 30)
    //  use callback, relies on idx
    // .hsl method -> hue, saturation, light
    .attr('fill', (num, idx) => d3.hsl(idx * 30, 1.0, 0.8));
})();

(() => {
  const reposPerLang = [
    {language: 'JavaScript', repos: 323938},
    {language: 'Java', repos: 222852},
    {language: 'Python', repos: 164852},
  ];

  // Dimensions we'll use to calculate the positions, widths, and heights of
  // our shapes.
  //
  // Each group will have a 150x150 rectangle in it. We also have a margin so
  // they're not all crammed together
  const groupWidth = 150;
  const groupHeight = 150;
  const margin = 10;

  const svg = d3
    .select('#repos-per-lang')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%');

  const groups = svg
    .selectAll('g') // 'g' is the SVG group element
    .data(reposPerLang)
    .enter()
    .append('g')
    // Set the position of each group based on index number
    .attr('transform', (data, idx) => `translate(${idx * (groupWidth + margin)}, 0)`);

  groups
    .append('rect')
    .attr('width', groupWidth)
    .attr('height', groupHeight)
    .attr('fill', 'transparent')
    .attr('stroke', 'rgb(111, 111, 111)');

  groups
    .append('circle')
    .attr('cx', groupWidth / 2)
    .attr('cy', groupHeight / 2)
    .attr('fill', 'rgba(111, 111, 111, 0.2)')
    .attr('r', data => {
      // Use # of repos to calculate radius of circle.

      // Before we can do that, we need to generate a d3 function that will
      // scale our # of repos so that the circle will fit inside its group
      const getScaledNum = d3
        .scaleLinear()
        .domain([
          reposPerLang[reposPerLang.length - 1].repos, // Smallest # of repos
          reposPerLang[0].repos, // Largest # of repos
        ])
        .range([10, groupWidth / 2 - 5]);

      return getScaledNum(data.repos);
    });

  groups
    .append('svg')
    .attr('width', groupWidth)
    .attr('height', groupHeight)
    .append('text')
    .attr('x', '50%')
    .attr('y', '50%')
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .text(data => data.language);
})();

fetch('/tech_topics.json')
  .then(response => response.json())
  .then(responseJson => {
    const container = document.querySelector('#force-layout');
    // getComputedStyle(container).width is a string like "10px" so parse it into a regular number
    const width = parseFloat(getComputedStyle(container).width.replace('px', ''));
    // d3.hiearchy will restructure the data from /tech_topics.json as a
    // hierarchical tree
    //
    // For more info see: https://github.com/d3/d3-hierarchy/blob/master/README.md#hierarchy
    const root = d3.hierarchy(responseJson);

    // Set coordinates for root node
    root.dx = 30; // This will determine how wide the tree is
    // Set `dy` to the middle of the container.
    // `root.height + 1` is the # of levels in the tree (in this case, 3)
    root.dy = width / (root.height + 1);

    // Then, create a tree based on root node's dimensions
    //
    // For more info see: https://github.com/d3/d3-hierarchy/blob/master/README.md#tree
    const treeLayout = d3.tree().nodeSize([root.dx, root.dy]);
    treeLayout(root);

    // Find the largest and smallest coordinates on the x-axis to calculate the
    // height of our parent container (#force-layout)
    let min = Infinity;
    let max = -Infinity;
    root.each(d => {
      if (d.x > max) {
        max = d.x;
      }

      if (d.x < min) {
        min = d.x;
      }
      container.style.height = max - min + root.dx * 2;

      if (d.x < min) {
        min = d.x;
      }
      container.style.height = max - min + root.dx * 2;
    });
    // d3.scaleSequential will return a function that we'll use to color the
    // links of the tree
    //
    // For more info see:
    // - https://github.com/d3/d3-scale#sequential-scales
    // - https://github.com/d3/d3-scale-chromatic#interpolateWarm
    const color = d3.scaleSequential(d3.interpolateWarm).domain([0, root.links().length - 1]);

    const svg = d3.select('#force-layout').append('svg');

    // Create a group to cover the entire `svg`. This makes it easier to position
    // the nodes and links in the tree.
    const g = svg.append('g').attr('transform', `translate(${root.dy / 3}, ${root.dx - min})`);

    g.append('g')
      .attr('fill', 'none')
      .attr('stroke-width', 5.5)
      .selectAll('path')
      .data(root.links())
      .enter()
      .append('path')
      .attr('stroke', (d, idx) => color(idx))
      .attr(
        'd',
        // d3.linkHorizontal returns a function that will automatically
        // generate nice, curvy paths. We'll use this function as a callback.
        //
        // For more info see: https://github.com/d3/d3-shape#linkHorizontal
        d3
          .linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
      );

    const node = g
      .append('g') // Use a group to apply styles to all nodes
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width', 3)
      .selectAll('g')
      // root.descendants() is all nodes except for the root.
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.y}, ${d.x})`);

    node
      .append('circle')
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 2.5)
      .attr('r', 4.5);

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', d => {
        // If the node has children, move text to the left of the .
        // Otherwise, move it to the right.
        if (d.children) {
          return -9;
        }
        return 9;
      })
      .attr('text-anchor', d => {
        // This also helps us align text
        if (d.children) {
          return 'end';
        }
        return 'start';
      })
      .attr('font-size', 14)
      .text(d => d.data.name)
      .clone(true)
      .lower() // Copy text and give it a white outline
      .attr('stroke', 'white');
  });
