import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const CharBart = ({ data, text }: any) => {
  const filteredData = data.filter(
    (item: any) => item.monitor_cloro_tipo === text
  );

  const abbreviationMap: { [key: string]: string } = {
    "Vivienda Intermedia": "V. I",
    "Primera Vivienda": "P. V",
    "Reservorio": "Rsvr",
    "Ultima Vivienda": "U. V",
  };

  const lineData = filteredData.map((item: any) => ({
    value: item.monitor_cloro_value,
    dataPointText: item.monitor_cloro_value.toString(),
  }));

  const xAxisData = filteredData.map((item: any) =>
    abbreviationMap[item.monitor_cloro_punto] || item.monitor_cloro_punto
  );

  return (
    <View className="w-full overflow-hidden">
      <LineChart
        isAnimated
        areaChart1
        curved
        startFillColor={'red'}
        width={300}
        initialSpacing={14}
        data={lineData}
        height={90}
        startOpacity={0.4}
        endOpacity={0.4}
        spacing={74}
        color1="red"
        textColor1="blue"
        dataPointsHeight={-30}
        dataPointsColor1="blue"
        textShiftY={-2}
        textShiftX={-5}
        textFontSize={13}
        hideYAxisText
        xAxisLabelTextStyle={{ fontSize: 10, color: "black" }}
        xAxisLabelTexts={xAxisData}
        showXAxisIndices
      />
    </View>
  );
};

export default CharBart;
