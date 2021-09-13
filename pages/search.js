import { useRouter } from "next/dist/client/router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { format } from "date-fns";
import InfoCard from "../components/InfoCard";
import { MenuAlt1Icon } from "@heroicons/react/solid";
import getUnixTime from "date-fns/getUnixTime";
import differenceInDays from "date-fns/differenceInDays";
import Map from "../components/Map";

function Search({ searchResults, wpApiResults }) {
  console.log(wpApiResults);
  // var wpApiResults = wpApiResults[0].title.rendered;
  // console.log(wpApiResults);

  const router = useRouter();
  //   ES6 Deconstructuring
  const { location, startDate, endDate, noOfGuests } = router.query;

  const noOfDays = differenceInDays(new Date(endDate), new Date(startDate));

  const formattedStartDate = format(new Date(startDate), "dd MMMM yyyy");
  const formattedEndDate = format(new Date(endDate), "dd MMMM yyyy");
  const range = `${formattedStartDate} - ${formattedEndDate}`;

  return (
    <div>
      <Header placeholder={`${location} | ${range} | ${noOfGuests} guests`} />

      <main className="flex">
        <section className="flex-grow pt-14 px-6">
          <p className="text-xs">
            300+ Stays - {range} - for {noOfGuests} guests
          </p>

          <h1 className="text-3xl font-semibold mt-2 mb-6">
            Stays in {location}
          </h1>

          <div className="hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap">
            <p className="button">Cancellation Flexibility</p>
            <p className="button">Type of Place</p>
            <p className="button">Price</p>
            <p className="button">Rooms and Beds</p>
            <p className="button">More filters</p>
          </div>

          <div className="flex flex-col">
            {wpApiResults?.map((item) => (
              <InfoCard
                key={item.id}
                img={item["toolset-meta"]["field-group-for-stays"].img.raw}
                location={
                  item["toolset-meta"]["field-group-for-stays"].location.raw
                }
                title={item.title.rendered}
                star={item["toolset-meta"]["field-group-for-stays"].star.raw}
                description={
                  item["toolset-meta"]["field-group-for-stays"].description.raw
                }
                price={item["toolset-meta"]["field-group-for-stays"].price.raw}
                total={
                  item["toolset-meta"]["field-group-for-stays"].price.raw *
                  noOfDays
                }
              />
            ))}
            {/* {searchResults?.map(
              ({ img, location, title, description, star, price, total }) => (
                <InfoCard
                  key={img}
                  img={img}
                  location={wpApiResults}
                  title={title}
                  description={description}
                  star={star}
                  price={price}
                  total={total}
                />
              )
            )} */}
          </div>
        </section>

        <section className="hidden xl:inline-flex xl:min-w-[600px]">
          <Map wpApiResults={wpApiResults} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Search;

export async function getServerSideProps() {
  const searchResults = await fetch("https://links.papareact.com/isz").then(
    (res) => res.json()
  );

  const wpApiResults = await fetch(
    "https://airbnb-clone.codeligtdev.nl/wp-json/wp/v2/stay"
  ).then((res) => res.json());

  return {
    props: {
      searchResults,
      wpApiResults,
    },
  };
}
