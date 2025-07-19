<script lang="ts">
  import { Chart } from "svelte-echarts";
  import { init, use } from "echarts/core";
  import { TreemapChart } from "echarts/charts";
  import type { EChartsOption } from "echarts";
  import { onMount } from "svelte";
  import { SVGRenderer } from "echarts/renderers";
  import { darken, mix } from "$lib/utils/colors";
  import { readableExpense } from "$lib/utils/readable";
  import type { PopulatedProduct } from "$lib/types/product";

  let { productData }: { productData: PopulatedProduct } = $props();

  let red: string = $state("");
  let darkRed: string = $state("");
  let green: string = $state("");
  let darkGreen: string = $state("");

  let background: string = $state("");

  let options: EChartsOption = $derived(updateOptions(productData));

  function updateOptions(productData: PopulatedProduct): EChartsOption {
    if (!productData) {
      return {};
    }

    return {
      series: [
        {
          type: "treemap",
          top: 20,
          left: 0,
          right: 0,
          bottom: 20,
          nodeClick: false,
          breadcrumb: {
            show: false,
          },
          data: [
            {
              name: productData.name,
              value: productData.price,
              children: [
                {
                  name: "Profit",
                  value: productData.price - productData.expenses.totalCost,
                  itemStyle: {
                    color: mix(
                      green,
                      darkGreen,
                      (productData.price - productData.expenses.totalCost) /
                        productData.price,
                    ),
                    borderColor: darken(
                      mix(
                        green,
                        darkGreen,
                        (productData.price - productData.expenses.totalCost) /
                          productData.price,
                      ),
                      40,
                    ),
                    borderWidth: 2,
                  },
                  label: {
                    formatter: (params: any) => {
                      const value = params.data?.value as number;

                      return [
                        `{h|${params.data?.name}}`,
                        "{l|}",
                        `{v|${value}}`,
                      ].join("\n");
                    },
                    rich: {
                      h: {
                        fontSize: 12,
                        fontWeight: "bold",
                        color: background,
                        lineHeight: 20,
                      },
                      l: {
                        width: "100%",
                        height: 0,
                        borderWidth: 0.5,
                        borderColor: darken(
                          mix(
                            green,
                            darkGreen,
                            (productData.price -
                              productData.expenses.totalCost) /
                              productData.price,
                          ),
                          40,
                        ),
                        borderRadius: 2.5,
                      },
                      v: {
                        fontSize: 20,
                        color: background,
                        fontWeight: "bold",
                        lineHeight: 30,
                      },
                    },
                  },
                },
                {
                  name: "Expenses",
                  value: productData.expenses.totalCost,
                  children: Object.entries(productData.expenses)
                    .filter(([name, _]) => name != "totalCost")
                    .map(([category, value]) => ({
                      name: readableExpense(category),
                      value: value as number,
                      itemStyle: {
                        color: mix(
                          red,
                          darkRed,
                          (value as number) / productData.expenses.totalCost,
                        ),
                        borderColor: darken(
                          mix(
                            red,
                            darkRed,
                            (value as number) / productData.expenses.totalCost,
                          ),
                          40,
                        ),
                        borderWidth: 2,
                      },
                      label: {
                        formatter: (params: any) => {
                          const value = params.data?.value as number;

                          return [
                            `{h|${params.data?.name}}`,
                            "{l|}",
                            `{v|${value}}`,
                          ].join("\n");
                        },
                        rich: {
                          h: {
                            fontSize: 12,
                            fontWeight: "bold",
                            color: background,
                            lineHeight: 20,
                          },
                          l: {
                            width: "100%",
                            height: 0,
                            borderWidth: 0.5,
                            borderColor: darken(
                              mix(
                                red,
                                darkRed,
                                (value as number) /
                                  productData.expenses.totalCost,
                              ),
                              40,
                            ),
                            borderRadius: 2.5,
                          },
                          v: {
                            fontSize: 20,
                            color: background,
                            fontWeight: "bold",
                            lineHeight: 30,
                          },
                        },
                      },
                    })),
                },
              ],
            },
          ],
          label: {
            show: true,
            formatter: "{b}: {c}",
          },
        },
      ],
    };
  }

  onMount(() => {
    red = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-red",
    );

    darkRed = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-red-locked",
    );

    green = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-green",
    );

    darkGreen = getComputedStyle(document.documentElement).getPropertyValue(
      "--color-green-locked",
    );
  });

  use([TreemapChart, SVGRenderer]);
</script>

<div class="overflow-hidden h-full w-full col-span-3 row-span-3">
  <Chart {init} {options} />
</div>
