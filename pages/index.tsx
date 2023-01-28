import Head from 'next/head'
import convert from 'xml-js';

import useSWR, { Key, Fetcher } from 'swr'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

const fetcher = (url: string) => fetch(url).then(r => r.text()).then(data => JSON.parse(convert.xml2json(data)))

export default function Home() {
  const { data, error, isLoading } = useSWR<any, Error>("https://www.volby.cz/pls/prez2023/vysledky_kraj?kolo=2&nuts=CZ080", fetcher);
  if (isLoading) return <div />

  const karvina = data.elements[0].elements[0].elements.filter(obec => obec.attributes?.NUTS_OKRES === "CZ0803")[0].elements.filter(mesto => mesto.attributes?.CIS_OBEC === "598917")[0].elements
  const orlova = data.elements[0].elements[0].elements.filter(obec => obec.attributes?.NUTS_OKRES === "CZ0803")[0].elements.filter(mesto => mesto.attributes?.CIS_OBEC === "599069")[0].elements

  const chartDataKarvina = [{
    name: "Andrej Babiš",
    hlasy: karvina.find(kandidat => kandidat.attributes?.PORADOVE_CISLO === "7").attributes?.HLASY
  },
  {
    name: "Pavel Petr",
    hlasy: karvina.find(kandidat => kandidat.attributes?.PORADOVE_CISLO === "4").attributes?.HLASY
  }
  ]

  const chartDataOrlova = [{
    name: "Andrej Babiš",
    hlasy: orlova.find(kandidat => kandidat.attributes?.PORADOVE_CISLO === "7").attributes?.HLASY
  },
  {
    name: "Pavel Petr",
    hlasy: orlova.find(kandidat => kandidat.attributes?.PORADOVE_CISLO === "4").attributes?.HLASY
  }
  ]
  console.log(chartDataKarvina)
  return (
    <>
      <Head>
        <title>Jak volí Karviná a Orlová?</title>

        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ padding: "32px", fontFamily: "Arial" }}>
        <h1 style={{ marginBottom: "32px" }}>
          Jak volí Karviná a Orlová
          Karviná
          {/* Pavel: {karvina_pavel}
            Babiš: {karvina_babis} */}
        </h1>
        <div style={{ display: "flex", gap: "100px" }}>
          <div>
            <h2 style={{ marginBottom: "32px" }}>Karviná</h2>
            <BarChart
              width={500}
              height={300}
              data={chartDataKarvina}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hlasy" fill="#8884d8" />
            </BarChart>
          </div><div>
            <h2 style={{ marginBottom: "32px" }}>Orlová</h2>
            <BarChart
              width={500}
              height={300}
              data={chartDataOrlova}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hlasy" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>
    </>
  )
}
