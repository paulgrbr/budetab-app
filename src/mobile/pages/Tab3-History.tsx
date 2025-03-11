import "./Tab3-History.css";
import "swiper/css";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import CalendarItem from "@/components/CalendarItem";
import ProductItem from "@/components/ProductItem";

const History: React.FC = () => {
  // Set the center week (current week)
  const [centerWeek, setCenterWeek] = useState(DateTime.now().startOf("week"));
  const [selectedDay, setSelectedDay] = useState(DateTime.now());

  // Generate 9 weeks: current week ±4 weeks
  const weeks = Array.from({ length: 9 }, (_, i) =>
    centerWeek.plus({ weeks: i - 4 })
  );

  // When slide transition ends, if active slide is not center, update centerWeek
  const handleSlideChangeEnd = (swiper: { activeIndex: number }) => {
    const newIndex = swiper.activeIndex;
    if (newIndex !== 4) {
      setCenterWeek(weeks[newIndex]);
    }
    const weekday = selectedDay.weekday;
    setSelectedDay(centerWeek.set({ weekday }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonTitle>Einträge</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <div className="ion-padding">
              <IonTitle size="large">
                {selectedDay.setLocale("de").toFormat("MMMM, yyyy")}
              </IonTitle>
            </div>
            <div className="ion-padding">
              <Swiper
                key={centerWeek.toISO()}
                spaceBetween={40}
                slidesPerView={1}
                onSlideChangeTransitionEnd={handleSlideChangeEnd}
                preventClicks={false}
                preventClicksPropagation={false}
                touchStartPreventDefault={false}
                initialSlide={4}
              >
                {weeks.map((weekStart, index) => (
                  <SwiperSlide key={index}>
                    <div className="history-calendar-selector">
                      {[...Array(7)].map((_, i) => {
                        const day = weekStart.plus({ days: i });
                        return (
                          <CalendarItem
                            key={i}
                            weekday={day
                              .setLocale("de")
                              .toFormat("EEE")
                              .replace(".", "")}
                            dayOfMonth={day.setLocale("de").toFormat("d")}
                            selected={day.hasSame(selectedDay, "day")}
                            hasEntry={true}
                            onClick={() => setSelectedDay(day)}
                          />
                        );
                      })}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </IonToolbar>
        </IonHeader>
        <div className="history-content-section ion-padding">
          <h5>Deine Einträge</h5>
          <div style={{ height: "0.1rem" }} />
          <ProductItem
            title={"Paulaner Spezi"}
            subtitle={"21:45 Uhr"}
            amount={2}
            price={16.0}
            image={"/product_15.png"}
            onClick={() => {}}
          />
          {/* <div className="history-no-entries-text">
            <p>
              <b>Keine Einträge</b> am
            </p>
            <p>
              {selectedDay.setLocale("de").toLocaleString(DateTime.DATE_FULL)}
            </p>
          </div> */}
          {/* <div>
            <ProductItemSkeleton fadeOut={false} />
            <ProductItemSkeleton fadeOut={false} />
            <ProductItemSkeleton fadeOut={true} />
          </div> */}
          <span className="history-total-hline"></span>
          <span className="history-total-text">
            {/* <Skeleton width="15ch" height="1.2rem" variant="shine" /> */}
            <b>
              <p>Summe:</p>
            </b>
            <p>0,00€</p>
          </span>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default History;
