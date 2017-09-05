#broadband data
#double check the number of missing data for pcat
options(scipen=10000)
library(tidyverse)
library(metromonitor)
library(jsonlite)
library(readxl)

data <- read_csv("/home/alec/Projects/Brookings/broadband/build/data/Masterfile.txt")
data$atl3 <- substring(data$atl3,1,1)
data$atl10 <- substring(data$atl10,1,1)
data$atl25 <- substring(data$atl25,1,1)
data$above1g <- substring(data$above1g,1,1)
data$pov <- data$inpov/data$povuniv
data$ba <- data$baplus_1115/data$edattain_univ_1115
data$ki <- data$u18_1115/data$pop_1115
data$access <- ifelse(data$atl25=="N", 0, data$pop_1115)

DTA <- data[, c("cbsa","tract","stplfips","atl25","pcat_10x1","pop_1115","ba","pov","ki","inc_cat","hh_medinc_1115")]
names(DTA) <- c("cbsa","tr","pl","av","su","pop","ba","pov","ki","inc","medinc")

DTA$sub <- factor(ifelse(DTA$su==0, 1, DTA$su), labels=c("0–20%","20–40%","40–60%","60–80%","80–100%"))
#DTA$inc_cat <- factor(DTA$inc, labels=c("low", "middle","high"))
#DTA$inc_cat <- cut(DTA$medinc, 25, na.rm=TRUE)
DTA$inc_cat <- cut(DTA$medinc, quantile(DTA$medinc, seq(0,1,0.2), na.rm=TRUE), dig.lab=10)

group_by(DTA, inc_cat) %>% summarise(n = n())

#maxcut <- max((DTA %>% group_by(inc_cat) %>% summarise(people = sum(pop)))$people)
sum_by_inc <- DTA %>% group_by(inc_cat, sub) %>% summarise(people = sum(pop)) %>% do((function(g){
  g$share <- g$people/sum(g$people)
  #g$width <- sum(g$people) / maxcut
  return(g)
})(.))

ggplot(sum_by_inc) + geom_col(aes(x=inc_cat, y=people, fill=sub), na.rm=TRUE, position="stack") + coord_flip()

mosaicplot(table(sum_by_inc$inc_cat, sum_by_inc$sub), shade=TRUE)

DTA$ba_cat <- cut(DTA$ba, quantile(DTA$ba, seq(0,1,0.1), na.rm=TRUE))
#DTA$ba_cat <- cut(DTA$ba, 10, na.rm=TRUE)

sum_by_ba <- DTA %>% group_by(ba_cat, sub) %>% summarise(people = sum(pop)) %>% do((function(g){
  g$share <- g$people/sum(g$people)
  return(g)
})(.))

ggplot(sum_by_ba) + geom_col(aes(x=ba_cat, y=people, fill=sub), na.rm=TRUE, position="stack")

ggplot(DTA) + geom_jitter(aes(x=ba, y=sub, alpha=pop))

##CORRELATES OF BROADBAND ADOPTION 
ggadoption <- ggplot(data2[!is.na(data2$pcat_10x1) & data2$pop_1115>0, ])

ggadoption + geom_density(aes(x=foreign_1115/pop_1115), alpha=0.2) + facet_wrap("pcat_10x1", ncol=6)

ggadoption + geom_density(aes(x=(lesshs_1115+hs_1115)/pop_1115), alpha=0.2) + facet_wrap("pcat_10x1", ncol=6)

#function to go from vector of values to vector of deciles
dec <- function(v, wgt=NULL){
  if(!is.null(wgt)){
    vv <- do.call("c", lapply(1:length(v), function(i){
      return(rep(v[i], wgt[i]))
    }))
  } else{
    vv <- v
  }
  
  pctl <- ecdf(vv)
  
  p <- pctl(v)
  return(ceiling(p*5))
}

#create a distribution matrix where each cell is the share of the population 
#cell defined by indicator decile crossed with adoption quintile

#data frame with no missing adoption data and where pop is greater than 0
data3 <- data2 %>% filter(!is.na(pcat_10x1), pop_1115>0) %>% 
  mutate(fb_share=foreign_1115/pop_1115, white_share=whiteNH_1115/pop_1115, black_share=blackNH_1115/pop_1115,
         hispanic_share=hisp_1115/pop_1115, hs_share=(lesshs_1115+hs_1115)/pop_1115, age65plus_share=`_65plus`/pop_1115,
         pov_share=inpov/povuniv)


distribute <- function(indicator){
  tot <- sum(data3$pop_1115)
  df <- data.frame(decile=dec(data3[ ,indicator]), pop=data3$pop_1115, adoption_lvl=data3$pcat_10x1, indicator=indicator)
  summary <- df %>% group_by(decile, adoption_lvl, indicator) %>% summarise(pop=sum(pop), popshare=sum(pop)/tot)
  return(as.data.frame(summary))
}

distros <- do.call("rbind", lapply(c("fb_share","hs_share","hh_medinc_1115","age65plus_share"), distribute))

ggplot(distros, aes(y=decile, x=adoption_lvl, fill=popshare)) + geom_tile() + facet_wrap("indicator") + 
  scale_fill_gradient(low="#ffffff", high="#0033ff")

#ggplot(data3) + geom_hex(bins=10) #hexbin not installed

ggplot(distros) + geom_col(aes(x=decile, y=popshare, fill=as.factor(adoption_lvl))) + facet_wrap("indicator") + scale_fill_discrete()
