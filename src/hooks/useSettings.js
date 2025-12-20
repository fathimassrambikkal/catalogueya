import { useState, useEffect } from "react";
import { getSettings } from "../api";
import Cookies from "js-cookie";

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lang = Cookies.get("lang") || "en";
  const CACHE_KEY = `settings_${lang}`;

  useEffect(() => {
    let mounted = true;

    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      setSettings(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        let data = res?.data?.data?.settings || {};

        console.log("🔍 Raw API response received", data);
        
        // Function to parse JSON strings from fields
        const parseImageArray = (fieldValue) => {
          if (!fieldValue) return [];
          
          console.log(`🔄 Parsing field value:`, fieldValue);
          
          // If it's already an array, return it
          if (Array.isArray(fieldValue)) {
            // Check if it's an array with a JSON string inside
            if (fieldValue.length === 1 && typeof fieldValue[0] === 'string') {
              const str = fieldValue[0];
              if (str.includes('[') && str.includes(']')) {
                try {
                  // Clean the string and parse
                  const cleanStr = str
                    .replace(/\\\//g, '/')  // Fix escaped slashes
                    .replace(/\\"/g, '"');  // Fix escaped quotes
                  
                  const match = cleanStr.match(/\[.*\]/);
                  if (match) {
                    const parsed = JSON.parse(match[0]);
                    return parsed.map(item => {
                      const cleanItem = String(item).trim();
                      if (cleanItem.startsWith('http')) {
                        return cleanItem;
                      }
                      return `https://catalogueyanew.com.awu.zxu.temporary.site/${cleanItem}`;
                    });
                  }
                } catch (err) {
                  console.warn(`Failed to parse array:`, err);
                  return [];
                }
              }
            }
            return fieldValue;
          }
          
          // If it's a string, check if it contains JSON
          if (typeof fieldValue === 'string') {
            // Clean the string first
            const cleanStr = fieldValue
              .replace(/\\\//g, '/')
              .replace(/\\"/g, '"');
            
            console.log(`🔍 Cleaned string:`, cleanStr);
            
            // Check if it contains a JSON array
            if (cleanStr.includes('[') && cleanStr.includes(']')) {
              try {
                const match = cleanStr.match(/\[.*\]/);
                if (match) {
                  console.log(`🔍 Found JSON array:`, match[0]);
                  const parsed = JSON.parse(match[0]);
                  console.log(`🔍 Parsed:`, parsed);
                  
                  return parsed.map(item => {
                    const cleanItem = String(item).trim();
                    if (cleanItem.startsWith('http')) {
                      return cleanItem;
                    }
                    return `https://catalogueyanew.com.awu.zxu.temporary.site/${cleanItem}`;
                  });
                }
              } catch (err) {
                console.warn(`Failed to parse string as JSON:`, err);
                console.warn(`String was:`, cleanStr);
              }
            }
            
            // If no JSON found, return as single item array (for logo)
            return [fieldValue.replace(/\\/g, '')];
          }
          
          return [];
        };

        // Process all fields
        const processedData = {};
        Object.keys(data).forEach(key => {
          const value = data[key];
          
          // Handle image array fields
          const imageArrayFields = ['hero_backgrounds', 'about_imgs', 'partners_imgs'];
          
          if (imageArrayFields.includes(key)) {
            processedData[key] = parseImageArray(value);
            console.log(`✅ Processed ${key}:`, processedData[key]);
          } else {
            // For other fields, just clean backslashes if it's a string
            if (typeof value === 'string') {
              processedData[key] = value.replace(/\\/g, '');
            } else {
              processedData[key] = value;
            }
          }
        });

        console.log("✅ Final processed settings:", {
          logo: processedData.logo,
          hero_backgrounds: processedData.hero_backgrounds,
          about_imgs: processedData.about_imgs,
          partners_imgs: processedData.partners_imgs
        });

        if (mounted) {
          setSettings(processedData);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(processedData));
        }
      } catch (err) {
        console.error("❌ Error fetching settings:", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSettings();

    return () => { mounted = false };
  }, [lang]);

  return { settings, loading, error };
};