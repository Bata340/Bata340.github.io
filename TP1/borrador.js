//LUZ SPOTLIGHT

struct SpotLightInfo {
                vec4 position; // Position in eye coords.
                vec3 intensity; // Amb., Diff., and Specular intensity
                vec3 direction; // Normalized direction of the spotlight
                float exponent; // Angular attenuation exponent
                float cutoff; // Cutoff angle (between 0 and 90)
            };
            uniform SpotLightInfo Spot;

            vec3adsWithSpotlight( ){
                vec3 s = normalize( vec3( Spot.position) - vPosWorld );
                float angle = acos( dot(-s, Spot.direction) );
                float cutoff = radians( clamp( Spot.cutoff, 0.0, 90.0 ) );
                vec3 ambient = Spot.intensity * Ka;
                if( angle < cutoff ) {
                    float spotFactor = pow( dot(-s, Spot.direction),
                        Spot.exponent );
                    vec3 v = normalize(vec3(-Position));
                    vec3 h = normalize( v + s );
                    return
                        ambient +
                        spotFactor * Spot.intensity * (
                            Kd * max( dot(s, Normal), 0.0 ) +
                        Ks * pow(max(dot(h,Normal), 0.0),Shininess));
                } else {
                    return ambient;
                }
            }


//PINTAR CON COLORES SIN TEXTURAS
//vec3 lightVec=normalize(vec3(0.0,3.0,5.0)-vPosWorld);
//vec3 diffColor=mix(vec3(0.7,0.7,0.7),vNormal,0.4);
//vec3 color=dot(lightVec,vNormal)*colorVec;
//gl_FragColor = vec4(color,1.0);