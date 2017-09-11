#broadband data
library(tidyverse)

data <- read_csv("/home/alec/Projects/Brookings/broadband/build/data/Masterfile.txt")
data$ba <- data$baplus_1115/data$edattain_univ_1115
data$hs <- (data$hs_1115 + data$lesshs_1115)/data$edattain_univ_1115

#subset, remove obs with missing subscription data
DTA <- data[!is.na(data$pcat_10x1), c("cbsa","tract","pcat_10x1","pop_1115","ba","hs","hh_medinc_1115","edattain_univ_1115")]

#check on number of missings
nrow(data)-nrow(DTA)
miss_hs <- filter(DTA, is.na(hs))
miss_inc <- filter(DTA, is.na(hh_medinc_1115))

DTA$sub <- factor(ifelse(DTA$pcat_10x1==0, 1, DTA$pcat_10x1), levels=1:5, labels=c("0-20%","20-40%","40-60%","60-80%","80-100%"))
DTA$inc_cat <- cut(DTA$hh_medinc_1115, quantile(DTA$hh_medinc_1115, seq(0,1,0.2), na.rm=TRUE), include.lowest=TRUE, dig.lab=10)
DTA$hs_cat <- cut(DTA$hs, quantile(DTA$hs, seq(0,1,0.2), na.rm=TRUE), include.lowest=TRUE)

group_by(DTA, inc_cat) %>% summarise(n = n())
group_by(DTA, hs_cat) %>% summarise(n = n())

group_share <- function(g){
  g$share <- g$inc_by_sub/sum(g$inc_by_sub)
  return(g)
}

#summarise data
sum_by_inc <- DTA %>% filter(!is.na(inc_cat)) %>% 
                      group_by(inc_cat, sub) %>% 
                      summarise(inc_by_sub=sum(pop_1115, na.rm=TRUE)) %>% 
                      group_by(inc_cat) %>% 
                      mutate(share=inc_by_sub/sum(inc_by_sub, na.rm=TRUE))

sum_by_inc2 <- DTA %>% filter(!is.na(inc_cat)) %>% 
                       group_by(inc_cat, sub) %>% 
                       summarise(inc_by_sub = sum(pop_1115)) %>% 
                       do(group_share(.))
identical(sum_by_inc, sum_by_inc2) #TRUE

sum_by_hs <- DTA %>% filter(!is.na(hs_cat)) %>% 
                     group_by(hs_cat, sub) %>% 
                     summarise(hs_by_sub=sum(pop_1115, na.rm=TRUE)) %>% 
                     group_by(hs_cat) %>% 
                     mutate(share=hs_by_sub/sum(hs_by_sub, na.rm=TRUE))

sum(sum_by_hs$hs_by_sub) == sum(DTA$pop_1115) - sum(miss_hs$pop_1115)
sum(sum_by_inc$inc_by_sub) == sum(DTA$pop_1115) - sum(miss_inc$pop_1115)

#draw
scale <- scale_fill_manual(values=c('#a50f15','#ef3b2c','#9ecae1','#6baed6','#084594'), 
                           limits=c("0-20%","20-40%","40-60%","60-80%","80-100%"))

ggplot(sum_by_inc, aes(x=inc_cat, y=share, group=sub)) + 
  geom_col(aes(fill=sub), position="stack") + 
  geom_text(aes(label=paste0(round(share*100,1),"%")), position=position_stack(vjust=0.5)) +
  scale + theme_bw() + theme(legend.position="bottom") +
  ggtitle("Share of population by neighborhood broadband subscription rates for neighborhoods with low to high median household income")

ggsave("subscription_by_income.pdf", path="/home/alec/Projects/Brookings/broadband/build/static_graphics", width=7.25, height=4.5)


ggplot(sum_by_hs, aes(x=hs_cat, y=share, group=sub)) + 
  geom_col(aes(fill=sub), position="stack") + 
  geom_text(aes(label=paste0(round(share*100,1),"%")), position=position_stack(vjust=0.5)) +
  scale + theme_bw() + theme(legend.position="bottom") +
  ggtitle("Share of population by neighborhood broadband subscription rates for neighborhoods with low to high shares of residents who have not attained education beyond high school")

ggsave("subscription_by_hsattainment.pdf", path="/home/alec/Projects/Brookings/broadband/build/static_graphics", width=7.25, height=4.5)




