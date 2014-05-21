define(function ()
{

	function mapConceptData(data)
	{
		var result;

		if (data.CountValue instanceof Array) // multiple rows, each value of each column is in the indexed properties.
		{
			result = data.CountValue.map(function (d, i)
			{
				var datum = {}
				datum.id = this.ConceptId[i];
				datum.label = this.ConceptName[i];
				datum.value = this.CountValue[i];
				return datum;
			}, data);

			result = result.sort(function (a, b)
			{
				return b.label < a.label ? 1 : -1;
			});
		}
		else // the dataset is a single value result, so the properties are not arrays.
		{
			result = [
			{
				id: data.ConceptId,
				label: data.ConceptName,
				value: data.CountValue
			}];
		}
		return result;
	}

	function mapHistogram(histogramData)
	{
		// result is an array of arrays, each element in the array is another array containing information about each bar of the histogram.
		var result = new Array();
		var minValue = histogramData.min;
		var intervalSize = histogramData.intervalSize;

		for (var i = 0; i <= histogramData.intervals; i++)
		{
			var target = new Object();
			target.x = minValue + 1.0 * i * intervalSize;
			target.dx = intervalSize;
			target.y = histogramData.data.CountValue[histogramData.data.IntervalIndex.indexOf(i)] || 0;
			result.push(target);
		};

		return result;
	}

	function mapBarToHistogram(barData, intervalSize)
	{
		// result is an array of arrays, each element in the array is another array containing information about each bar of the histogram.
		var result = new Array();
		for (var i = 0; i < barData.category.length; i++)
		{
			var target = new Object();
			target.x = barData.category[i];
			target.dx = intervalSize;
			target.y = barData.counts[i];
			result.push(target);
		};

		return result;
	}


	function mapMonthYearDataToSeries(data, options)
	{
		var defaults = {
			dateField: "x",
			yValue: "y",
			yPercent: "p"
		};

		var options = $.extend(
		{}, defaults, options);

		var series = {};
		series.name = "All Time";
		series.values = [];
		for (var i = 0; i < data[options.dateField].length; i++)
		{
			var dateInt = data[options.dateField][i];
			series.values.push(
			{
				xValue: new Date(Math.floor(data[options.dateField][i] / 100), (data[options.dateField][i] % 100)-1,1),
				yValue: data[options.yValue][i],
				yPercent: data[options.yPercent][i]
			});
		}
		series.values.sort(function (a, b)
		{
			return a.xValue - b.xValue;
		});
		
		return [series]; // return series wrapped in an array
	}

	function mapMonthYearDataToSeriesByYear(data, options)
	{
		// map data in the format yyyymm into a series for each year, and a value for each month index (1-12)
		var defaults = {
			dateField: "x",
			yValue: "y",
			yPercent: "p"
		};

		var options = $.extend(
		{}, defaults, options);

		// this function takes month/year histogram data from Achilles and converts it into a multi-series line plot
		var series = [];
		var seriesMap = {};

		for (var i = 0; i < data[options.dateField].length; i++)
		{
			var targetSeries = seriesMap[Math.floor(data[options.dateField][i] / 100)];
			if (!targetSeries)
			{
				targetSeries = {
					name: (Math.floor(data[options.dateField][i] / 100)),
					values: []
				};
				seriesMap[targetSeries.name] = targetSeries;
				series.push(targetSeries);
			}
			targetSeries.values.push(
			{
				xValue: data[options.dateField][i] % 100,
				yValue: data[options.yValue][i],
				yPercent: data[options.yPercent][i]
			});
		}
		series.forEach(function (d)
		{
			d.values.sort(function (a, b)
			{
				return a.xValue - b.xValue;
			});
		});
		return series;
	}

	var module = {
		mapHistogram: mapHistogram,
		mapConceptData: mapConceptData,
		mapBarToHistogram: mapBarToHistogram,
		mapMonthYearDataToSeries: mapMonthYearDataToSeries,
		mapMonthYearDataToSeriesByYear: mapMonthYearDataToSeriesByYear
	};

	return module;
});