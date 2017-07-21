#broadband data

library(tidyverse)

data <- read_csv("/home/alec/Projects/Brookings/broadband/build/data/Masterfile.txt")

data$yn25 <- ifelse(data$atl25=="NoProviders", "No", "Yes")

summary <- data %>% group_by(cbsa, metro, yn25) %>% summarise(total=sum(pop_1115, na.rm=TRUE)) %>% 
                    spread(yn25, total, fill=0) %>% mutate(Ysh = Yes/(Yes+No), Nsh = No/(Yes+No))


#2014 gazetteer tract file seems to match
gaz <- read_tsv("/home/alec/Projects/Brookings/broadband/build/data/gazetteer/2014_Gaz_tracts_national.txt", col_types="ccnnnnnn")
#gaz$density <- gaz$POP10/gaz$ALAND_SQMI

data2 <- merge(data, gaz, by.x="tract", by.y="GEOID", all.x = TRUE)
data2$density <- ifelse(data2$ALAND_SQMI>0, data2$pop_1115/data2$ALAND_SQMI, NA)
data2[data2$ALAND_SQMI==0 & data2$pop_1115>0, ]

mean_ <- function(a){return(mean(a, na.rm=TRUE))}
median_ <- function(a){return(median(a, na.rm=TRUE))}
nonzero <- function(a){return(sum(!is.na(a)))}

summary2a <- data2 %>% filter(pop_1115 > 0) %>% 
                       group_by(cbsa, metro) %>% 
                       summarise(mean_density=mean(density), 
                                 median_density=median(density), 
                                 ntracks=n(), 
                                 pop=sum(pop_1115), 
                                 sqmi=sum(ALAND_SQMI))

summary2a$density = summary2a$pop/summary2a$sqmi

summary2b <- data2 %>% filter(pop_1115 > 0) %>% 
                       group_by(cbsa, metro, yn25) %>% 
                       summarise(mean_density=mean(density)) %>%
                       spread(yn25, mean_density) %>% 
                       rename(Ydensity=Yes, Ndensity=No)

summary2c <- data2 %>% group_by(cbsa, metro, yn25) %>% 
                       summarise(sqmi=sum(ALAND_SQMI)) %>%
                       spread(yn25, sqmi) %>% 
                       rename(Ysqmi=Yes, Nsqmi=No)

summary2d <- data2 %>% group_by(cbsa, metro, yn25, geotype) %>% 
                       summarise(pop=sum(pop_1115)) %>%
                       filter(geotype==2 | geotype==1, yn25=="No") %>%
                       group_by(cbsa, metro, yn25) %>%
                       do({
                         d <- .
                         d$share <- d$pop/sum(d$pop)
                         d
                       })

#left off here -- building levels to make pie charts ordered from most suburban to least
levels <- summary2d %>% filter()

summary2d$name <- factor(summary2d$metro, levels=summary2d[order(summary2d$)])

#summary3 <- data2 %>% group_by(cbsa, metro, yn25) %>% summarise_at("density", funs(mean_density=mean(., na.rm=TRUE))) %>% spread(yn25, mean_density)

summary3 <- merge(merge(merge(summary, summary2a, by=c("cbsa","metro")), summary2b, by=c("cbsa","metro")), summary2c, by=c("cbsa","metro"))
summary3$Ydensity_unwgt <- summary3$Yes/summary3$Ysqmi
summary3$Ndensity_unwgt <- summary3$No/summary3$Nsqmi

library("metromonitor")

summary100 <- limit100(summary3, geoID="cbsa")
#correlations
with(summary100, cor(Nsh, mean_density))
with(summary100, cor(Nsh, log(density)))
with(summary100[summary100$Nsh>0, ], cor(Nsh, Ndensity))
with(summary100[summary100$Nsh>0, ], cor(Nsh, Ndensity_unwgt))

gg <- ggplot(summary100[summary100$density < 2000, ], aes(y=density, x=Nsh))
gg + geom_point(aes(size=No)) + geom_smooth()

gg <- ggplot(summary100, aes(y=log(density), x=Nsh))
gg + geom_point(aes(size=No)) + geom_smooth()

gg2 <- ggplot(summary100[summary100$Nsh>0, ], aes(Ndensity, x=Nsh))
gg2 + geom_point(aes(size=No)) + geom_smooth()

gg2 <- ggplot(summary100[summary100$Nsh>0, ], aes(y=Ndensity_unwgt, x=Nsh))
gg2 + geom_point(aes(size=No)) + geom_smooth()

gg3 <- ggplot(limit100(data2, geoID="cbsa"))
gg3 + geom_point(aes(x=density, y=pop_1115, colour=yn25), alpha=0.3) + 
      facet_wrap(c("geotype", "yn25")) +
      scale_x_continuous(limits=c(0,200000)) +
      scale_y_continuous(limits=c(0,25000))

#city/suburb
ggcs <- ggplot(summary2d[summary2d$yn25=="No", ])
ggcs + geom_col(aes(x=1, y=share, fill=geotype)) + coord_polar(theta="y") + facet_wrap(c("metro"))

#no missing tracts
data2[is.na(data2$ALAND_SQMI), c(1,9,64)]


